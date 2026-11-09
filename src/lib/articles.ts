export type Article = {
  id: string; title: string; slug: string; excerpt: string; category: string;
  content: string; published_at: string; reading_minutes: number;
};

export const starterArticles: Article[] = [
  {
    id:"1", title:"Building a Database-to-SFTP Integration Using Mule 4", slug:"database-to-sftp-mule4",
    excerpt:"A practical walkthrough of scheduled extraction, DataWeave mapping, SFTP delivery and safe status updates.",
    category:"Mule 4", published_at:"2026-11-09", reading_minutes:9,
    content:`# Database-to-SFTP integration: end to end

This pattern moves eligible records from a source database to a downstream system as a structured file. It is a useful way to learn orchestration, transformation, connectivity and failure handling in one Mule application.

![Database to SFTP integration flow](/diagrams/database-to-sftp.svg)

## 1. Understand the flow

1. A Scheduler starts the integration at an agreed interval.
2. A Database Select retrieves a limited set of eligible records.
3. DataWeave maps source columns to the target file layout.
4. The SFTP connector writes the file to a controlled destination.
5. The source records are marked complete only after the delivery is confirmed.
6. Logs and reconciliation data make the run traceable.

## 2. Select only eligible rows

Use a parameterized query and a stable ordering. Do not concatenate values directly into SQL.

```sql
SELECT customer_id, first_name, last_name, email, updated_at
FROM source_customer
WHERE processed_flag = :processedFlag
ORDER BY customer_id
LIMIT :batchSize;
```

The exact limit syntax and parameter binding depend on your database and connector configuration. For large volumes, use keyset pagination or a database-supported batch strategy rather than loading every row into memory.

## 3. Transform with DataWeave

```dw
%dw 2.0
output application/csv header=true, separator=","
---
(payload map (row) -> {
  customerId: row.customer_id as String,
  fullName: trim((row.first_name default "") ++ " " ++ (row.last_name default "")),
  email: row.email default "",
  updatedDate: (row.updated_at as DateTime) as String {format: "yyyy-MM-dd"}
})
```

Validate date types and timezone assumptions against the actual source schema. If the connector returns a LocalDateTime rather than DateTime, adjust the coercion accordingly.

## 4. Make file delivery safe

Build a unique filename using a batch identifier or timestamp. Write to a temporary name first when the target system supports atomic rename, then rename to the final name after the write completes. This reduces the chance that a consumer reads a partial file.

## 5. Update status only after delivery

A dangerous design marks rows processed before the SFTP write. If SFTP is unavailable, those rows may never be sent again. Update status after confirmed delivery, ideally in a transaction or through a durable batch ledger.

## 6. Production checklist

- Define batch size and maximum execution duration.
- Prevent overlapping scheduler runs or claim work atomically.
- Keep credentials in secure properties.
- Use retry limits with backoff for transient failures.
- Record batch ID, row count, filename and outcome.
- Reconcile source count against delivered file count.
- Decide how to recover from a partial batch.

## Practice exercise

What happens if SFTP writes the file successfully but the database status update fails? Design a recovery process that avoids sending duplicate business transactions. A robust answer uses a durable batch ID, target-side duplicate detection and reconciliation rather than relying on a single processed flag.`
  },
  {
    id:"2", title:"DataWeave 2.0: Seven Practical Transformation Techniques", slug:"dataweave-practical-techniques",
    excerpt:"Learn map, filter, default, flatten, mapObject, conditional mapping and date formatting with realistic examples.",
    category:"DataWeave", published_at:"2026-11-09", reading_minutes:8,
    content:`# DataWeave 2.0: seven techniques you will use often

DataWeave transforms data between formats such as JSON, XML, CSV and Java objects. The key to writing maintainable scripts is to understand the shape of the input and the shape expected by the target.

## 1. map: transform array items

Input is an array of customers. Output is another array with only the required fields.

```dw
%dw 2.0
output application/json
---
payload map (customer) -> {
  id: customer.customerId,
  name: customer.firstName ++ " " ++ customer.lastName
}
```

## 2. filter: keep matching records

```dw
%dw 2.0
output application/json
---
payload filter ((item) -> item.active == true)
```

Use filter before mapping when the target should receive only eligible records.

## 3. default: handle missing values

```dw
%dw 2.0
output application/json
---
{
  email: payload.email default "not-provided@example.invalid",
  city: payload.address.city default "Unknown"
}
```

A default is not a substitute for validation. Decide whether a missing value is acceptable, should be rejected, or should be represented as null.

## 4. flatten: remove one array nesting level

```dw
%dw 2.0
output application/json
---
flatten(payload.orders map ((order) -> order.items))
```

Use it only when the target expects one flat collection. Flattening can remove meaningful grouping.

## 5. mapObject: transform object key-value pairs

```dw
%dw 2.0
output application/json
---
payload mapObject ((value, key) -> {
  (upper(key)): value
})
```

## 6. Conditional mapping

```dw
%dw 2.0
output application/json
---
{
  customerType: if ((payload.totalSpend default 0) > 10000)
                  "PREMIUM"
                else
                  "STANDARD"
}
```

## 7. Date formatting

```dw
%dw 2.0
output application/json
---
{
  invoiceDate: (payload.invoiceDate as Date {format: "dd/MM/yyyy"})
                 as String {format: "yyyy-MM-dd"}
}
```

The input format must match the real source value. Always test timezone, null and invalid-date cases.

## How to debug a transformation

1. Copy a representative input payload.
2. Confirm whether each field is an array, object, string, number or null.
3. Build the output one field at a time.
4. Test empty arrays, missing keys and unexpected values.
5. Compare the output with the target contract.

## Interview checkpoint

Explain the difference between map and mapObject: map iterates over array elements and returns an array; mapObject iterates over object key-value pairs and returns an object.`
  },
  {
    id:"3", title:"Idempotency in MuleSoft: Preventing Duplicate Processing", slug:"mulesoft-idempotency",
    excerpt:"Design retry-safe APIs and scheduled integrations using business identifiers and durable processing states.",
    category:"Integration Patterns", published_at:"2026-11-09", reading_minutes:7,
    content:`# Idempotency: make retries safe

Distributed systems fail in inconvenient places. A request may reach a downstream service, complete successfully, and then time out before Mule receives the response. A retry can repeat the business operation unless the design protects against duplicates.

![Idempotent request lifecycle](/diagrams/idempotency.svg)

## Choose a stable business key

Use an identifier that represents the operation, for example order ID plus operation type. Do not use a new random UUID for every retry; retries need to resolve to the same key.

## Store the processing state durably

A simple ledger can contain idempotency_key, status, created_at, updated_at and downstream_reference. Add a unique constraint to the key so simultaneous requests cannot both claim the same operation.

Typical states:

- RECEIVED: request accepted.
- PROCESSING: a worker owns the operation.
- COMPLETED: downstream effect confirmed.
- FAILED: processing failed and can be recovered under controlled rules.

## Example decision logic

1. Attempt to insert the key with RECEIVED status.
2. If the unique key already exists, read its current status.
3. If COMPLETED, return the previously stored result.
4. If PROCESSING, return an agreed in-progress response or wait safely.
5. If FAILED, retry only when the failure is classified as recoverable.
6. Mark COMPLETED only after the downstream outcome is confirmed.

## Important edge case: timeout after success

Suppose the target created an order but Mule timed out waiting for the response. The ledger still says PROCESSING. Before repeating the create request, query the target using the business key or use a target API that supports idempotency keys.

## What not to do

- Do not rely only on an in-memory Object Store for critical cross-restart guarantees.
- Do not check then insert without a database uniqueness constraint; concurrent requests can race.
- Do not mark complete before the side effect is confirmed.
- Do not retry non-idempotent operations blindly.

## Test cases

Test a repeated request, simultaneous duplicate requests, timeout after target success, retry after a definite failure, worker restart and retention expiry. Log the correlation ID and idempotency key, but avoid logging sensitive payloads.`
  },
  {
    id:"4", title:"Mule 4 Event Anatomy: Message, Attributes and Variables", slug:"mule4-event-anatomy",
    excerpt:"Understand the Mule event and how payload, attributes and variables move through a flow.",
    category:"Mule 4 Fundamentals", published_at:"2026-11-09", reading_minutes:6,
    content:`# Mule 4 event anatomy

A Mule event is the information Mule processes as it moves through a flow. Understanding its parts helps explain why a connector changes the payload, why attributes differ between operations and why variables are useful for carrying context.

![Mule event anatomy](/diagrams/mule-event.svg)

## Message

The Mule message contains two main parts:

- Payload: the body or data being processed.
- Attributes: metadata about the payload, often supplied by a source or connector.

For an HTTP Listener, attributes can include method, path, headers and query parameters. For a Database Select, attributes can include database execution metadata depending on the connector operation.

## Variables

Variables store values on the event. Use them for values needed later in the flow, such as a correlation reference, a calculated filename or a validation result.

```xml
<set-variable variableName="batchId" value="#[uuid()]" />
<set-variable variableName="recordCount" value="#[sizeOf(payload)]" />
```

## Payload changes

Many operations replace the payload with their result. If you need the original value later, save it in a variable before calling the operation.

## Practical debugging

At each major flow step, inspect the payload type, payload shape, attributes and variables. Avoid logging secrets or personal data. Prefer a correlation ID and a small set of safe metadata.

## Interview checkpoint

Payload is the data body; attributes describe the message or source context; variables hold values you explicitly store during flow execution.`
  },
  {
    id:"5", title:"Scheduler vs HTTP Listener: Choosing a Mule Trigger", slug:"scheduler-vs-http-listener",
    excerpt:"Compare time-based jobs and request-driven APIs, including overlap, reliability and operational controls.",
    category:"Mule 4 Fundamentals", published_at:"2026-11-09", reading_minutes:6,
    content:`# Scheduler vs HTTP Listener

A trigger decides when a Mule flow begins. Scheduler and HTTP Listener solve different problems and should not be selected interchangeably.

## Scheduler

Use Scheduler when work should start based on time: every five minutes, every night or at a defined calendar interval. Examples include extracting pending database records, generating reports and sending scheduled notifications.

Considerations:

- Set an interval that matches the business SLA.
- Decide whether overlapping executions are allowed.
- Make the job restart-safe and idempotent.
- Monitor missed, delayed and failed runs.
- Use a watermark or durable work queue for large workloads.

## HTTP Listener

Use HTTP Listener when an external client initiates a request. Examples include a mobile app calling a customer API or another system submitting an order.

Considerations:

- Define request and response contracts.
- Validate authentication, authorization and input.
- Set timeouts and payload-size limits.
- Return appropriate HTTP status codes.
- Protect against duplicate submissions.

## Can a scheduled flow call an HTTP endpoint?

Yes, but separate the scheduling responsibility from the API contract. The scheduler can orchestrate a job and call a private process flow or an HTTP endpoint when there is a clear service boundary.

## Decision guide

Choose Scheduler for time-driven work. Choose HTTP Listener for request-driven work. For both, design error handling, observability and safe retry behavior explicitly.`
  },
  {
    id:"6", title:"Mule 4 Error Handling: On Error Continue vs Propagate", slug:"mule4-error-handling",
    excerpt:"Understand Try scopes, error handlers, retries and how to preserve the right failure semantics.",
    category:"Mule 4", published_at:"2026-11-09", reading_minutes:7,
    content:`# Mule 4 error handling

Error handling is part of the integration contract. A flow should not hide a failure simply to return a successful response.

## On Error Continue

Use On Error Continue when the handler has recovered the situation and the parent flow should continue as successful. Example: an optional enrichment failed, and the business process can continue with a documented fallback.

## On Error Propagate

Use On Error Propagate when the error must remain a failure and move to the calling flow or caller. Example: a required database write failed and the transaction cannot be considered complete.

## Try scope

A Try scope lets you apply local error handling around a group of processors. It is useful when one part of a larger flow has a different recovery policy.

## Retry strategy

Use retries for transient conditions such as temporary network errors or throttling. Use a bounded retry count, backoff and a timeout budget. Do not retry validation errors or permanent authorization failures without correcting the cause.

## Example design checklist

- Classify errors as connectivity, validation, transformation, business or system errors.
- Preserve the original error type and useful diagnostic context.
- Avoid logging credentials or full sensitive payloads.
- Return a stable API error contract.
- Route exhausted asynchronous work to a replay or dead-letter process.
- Test both the error path and the recovery path with MUnit.

## Interview checkpoint

On Error Continue handles an error and lets the parent continue; On Error Propagate handles or enriches the error but keeps the execution failed so it propagates.`
  },
  {
    id:"7", title:"API-Led Connectivity: System, Process and Experience APIs", slug:"api-led-connectivity-explained",
    excerpt:"Learn the three API layers, how responsibilities are separated and when not to add another API.",
    category:"API Architecture", published_at:"2026-11-09", reading_minutes:6,
    content:`# API-led connectivity explained

API-led connectivity organizes integration capabilities around reusable APIs. The familiar layers are System, Process and Experience. They describe responsibilities, not a mandatory count of applications.

![API-led connectivity layers](/diagrams/api-led.svg)

## System APIs

System APIs provide controlled access to systems of record such as databases, ERP platforms and CRM systems. They hide source-specific connectivity and expose stable contracts.

## Process APIs

Process APIs combine or orchestrate capabilities to implement a business process. For example, a customer onboarding process may combine customer, identity and notification capabilities.

## Experience APIs

Experience APIs shape data and operations for a particular consumer experience, such as mobile, web or partner channels.

## Example: customer profile

A System API retrieves customer information from a CRM. A Process API combines customer details with account status. An Experience API returns the compact response needed by a mobile application.

## Avoid overengineering

Do not create a separate API layer just to follow a diagram. Each API should have a clear owner, contract, lifecycle and reuse case. A thin pass-through API that adds no governance or abstraction may create unnecessary latency and maintenance.

## Interview checkpoint

System APIs abstract systems, Process APIs implement business orchestration, and Experience APIs tailor capabilities to consumer channels.`
  },
  {
    id:"8", title:"RAML and APIKit: From API Contract to Mule Flow", slug:"raml-apikit-mule4",
    excerpt:"Design a resource contract, define data types and connect the RAML specification to implementation flows.",
    category:"API Design", published_at:"2026-11-09", reading_minutes:7,
    content:`# RAML and APIKit: contract first

RAML describes an API contract: resources, methods, query parameters, request bodies, responses, data types and security schemes. APIKit can scaffold routing flows from a RAML specification in Mule.

## Start with a resource

```yaml
#%RAML 1.0
title: Customer API
version: v1
baseUri: https://api.example.com/{version}
mediaType: application/json
types:
  Customer:
    type: object
    properties:
      customerId: string
      name: string
      email?: string
/customers:
  get:
    responses:
      200:
        body:
          application/json:
            type: Customer[]
  /{customerId}:
    get:
      responses:
        200:
          body:
            application/json:
              type: Customer
        404:
          body:
            application/json:
              example: { message: "Customer not found" }
```

## Generate and implement

1. Validate the RAML in Anypoint Design Center or Studio.
2. Import the API specification into the Mule project.
3. Scaffold APIKit routing.
4. Implement the generated resource-method flows.
5. Map backend responses to the public contract.
6. Test success, validation, not-found and server-error cases.

## Contract quality checklist

Use consistent naming, explicit data types, examples, error responses and pagination conventions. Avoid exposing internal database column names. Treat backward-incompatible changes as a versioning decision.

## Interview checkpoint

RAML is the API definition; APIKit uses the specification to route incoming requests to the corresponding Mule implementation flows.`
  },
  {
    id:"9", title:"MUnit Testing: Test the Flow, Mock Dependencies", slug:"mulesoft-munit-testing",
    excerpt:"Build repeatable tests for transformations, connector failures, routing and error handling.",
    category:"Testing", published_at:"2026-11-09", reading_minutes:7,
    content:`# MUnit testing fundamentals

MUnit is MuleSoft's testing framework for validating Mule applications. A good test suite verifies both the intended result and how the flow behaves when dependencies fail.

## What to test

- Happy path with representative input.
- Empty payload and missing required fields.
- DataWeave null handling and type conversion.
- Database or HTTP connector error.
- Retry exhaustion and timeout.
- Error handler behavior and expected response.

## Mock external systems

Mock database, HTTP and SFTP operations so the test does not depend on a live external system. Assert that the correct processor was called and that the flow produced the expected payload or error.

## Example test shape

```xml
<munit:test name="customer-flow-test">
  <munit:execution>
    <flow-ref name="customer-flow"/>
  </munit:execution>
  <munit:validation>
    <munit-tools:assert-that
      expression="#[payload.status]"
      is="#[MunitTools::equalTo('SUCCESS')]"/>
  </munit:validation>
</munit:test>
```

This is an illustrative fragment; namespace declarations, test event setup and mocks must be added to match the project.

## Keep tests maintainable

Use small test cases with descriptive names. Keep test data synthetic. Avoid asserting incidental implementation details when a business-level assertion is more stable.

## Interview checkpoint

Explain how you mock an HTTP Request or Database operation, inject a failure and assert that the correct error handler executes.`
  },
  {
    id:"10", title:"CloudHub 2.0 Deployment and Runtime Manager Basics", slug:"cloudhub2-deployment-runtime-manager",
    excerpt:"Prepare an application, configure properties and replicas, deploy safely and verify runtime health.",
    category:"Deployment & Operations", published_at:"2026-11-09", reading_minutes:7,
    content:`# CloudHub 2.0 deployment and operations

A successful deployment is more than uploading a JAR. It includes environment selection, property configuration, runtime compatibility, network connectivity and post-deployment verification.

## Before deployment

1. Confirm the target environment and application name.
2. Verify the Mule runtime version and Java compatibility.
3. Review secure and non-secure properties.
4. Check required network routes, certificates and external endpoints.
5. Confirm replica sizing and scaling expectations.
6. Run unit tests and review the release artifact.

## Deployment verification

After deployment, inspect application status, replica health, logs and metrics in Runtime Manager. Execute a health endpoint or a controlled smoke test. Confirm dependencies such as database, SFTP, MQ and HTTP endpoints.

## Safe release practices

Use environment-specific configuration, immutable build artifacts and a rollback plan. Avoid manually changing production properties without change tracking. A green deployment status does not prove every business flow works.

## Troubleshooting first checks

- Is the application in a running state?
- Are all replicas healthy?
- Did secure properties resolve?
- Can the runtime reach the dependency host and port?
- Are certificates and truststores valid?
- Do logs show connection, authentication or deployment errors?
- Does a correlation ID trace the failed transaction?

## Interview checkpoint

Describe deployment preparation, configuration, runtime verification, smoke testing and rollback as one controlled release process.`
  },
  {
    id:"11", title:"Production Support: A Practical MuleSoft Incident Checklist", slug:"mulesoft-production-support-checklist",
    excerpt:"Triage API failures using correlation IDs, logs, dependency checks, impact analysis and clear RCA.",
    category:"Production Support", published_at:"2026-11-09", reading_minutes:8,
    content:`# Production support: investigate systematically

Production support is not just restarting an application. The goal is to restore service safely, understand the impact and prevent recurrence.

## 1. Establish impact

Find the affected API, environment, start time, error rate, business process and number of impacted transactions. Check whether the issue is isolated to one consumer or affects all traffic.

## 2. Trace one transaction

Use the correlation ID or transaction reference to follow the request across Mule logs and downstream systems. Compare a failed transaction with a successful one.

## 3. Check the dependency

Look for database pool exhaustion, SFTP connection failures, HTTP timeouts, MQ backlogs, expired certificates, DNS issues or downstream maintenance.

## 4. Check runtime health

Review application state, replica health, CPU, memory, worker or replica restarts and recent deployments or configuration changes.

## 5. Recover safely

Follow the incident runbook. Restart or redeploy only when evidence supports it and approvals permit it. Before replaying messages or files, confirm idempotency and whether the target already processed them.

## 6. Write a useful RCA

A clear RCA includes:

- Impact and timeline.
- Triggering event.
- Technical root cause, not just the visible symptom.
- Detection and mitigation.
- Data reconciliation performed.
- Corrective and preventive actions with owners.

## Example

If a scheduled database-to-SFTP flow fails, first check the scheduler execution and correlation ID, then database connectivity and SFTP reachability. Confirm whether the file was partially or fully delivered before replaying. Do not reset processed flags blindly.

## Interview checkpoint

Explain how you distinguish an application issue from a dependency issue and how you prevent duplicate processing during recovery.`
  },
  {
    id:"12", title:"DataWeave Null Handling, Types and Date Formatting", slug:"dataweave-null-types-dates",
    excerpt:"Avoid common transformation failures by validating nulls, coercing types carefully and handling dates explicitly.",
    category:"DataWeave", published_at:"2026-11-09", reading_minutes:7,
    content:`# DataWeave: nulls, types and dates

Many mapping defects are caused by assumptions about the incoming data. A field that looks like a number may arrive as a string; a nested object may be null; a date may use a different format in each source.

## Null and missing fields

```dw
%dw 2.0
output application/json
---
{
  phone: payload.phone default null,
  city: payload.address.city default "Unknown"
}
```

Be careful: if address itself is null, accessing address.city may require an explicit safe-navigation or conditional check depending on the expression. Validate nested structures rather than assuming they exist.

## Type coercion

```dw
%dw 2.0
output application/json
---
{
  amount: (payload.amount default "0") as Number,
  active: (payload.active default false) as Boolean
}
```

Coercion can fail for invalid strings. Decide whether to reject, default or route invalid records to an exception process.

## Date formatting

```dw
%dw 2.0
output application/json
---
{
  targetDate: (payload.sourceDate as Date {format: "dd-MM-yyyy"})
                 as String {format: "yyyy-MM-dd"}
}
```

If the source includes a time and timezone, parse it as DateTime and define the target timezone policy. Do not silently treat local time as UTC.

## Test matrix

Test null, missing, empty string, whitespace, malformed number, invalid date, leap day and timezone boundary. Keep examples in MUnit so future mapping changes do not reintroduce defects.`
  },
  {
    id:"13", title:"HTTP Request Connector: Timeouts, Retries and Error Responses", slug:"mule-http-request-timeouts-retries",
    excerpt:"Build resilient outbound HTTP calls with explicit timeouts, safe retries and predictable error mapping.",
    category:"Connectivity", published_at:"2026-11-09", reading_minutes:7,
    content:`# Reliable outbound HTTP calls

An HTTP Request operation connects a Mule flow to another service. Network calls can fail because of DNS, TLS, connection refusal, timeouts, throttling or application errors.

## Configure explicit timeouts

Set a response timeout based on the dependency's service objective and the overall API latency budget. A timeout that is too long ties up resources; one that is too short creates avoidable failures.

## Retry only when safe

Retry transient failures such as selected 429 or 5xx responses, connection resets and temporary timeouts. Respect Retry-After when provided. Use bounded attempts and backoff. Do not retry a non-idempotent POST unless the target supports an idempotency key or equivalent duplicate protection.

## Map errors consistently

Separate connectivity errors from business responses. Return a stable error body with a safe message, internal error code and correlation ID. Do not leak stack traces or credentials to API consumers.

## Operational checklist

- Configure TLS and trust correctly.
- Set connection and response timeouts.
- Define retryable status codes.
- Add circuit-breaker or bulkhead patterns where justified.
- Capture dependency latency and error rates.
- Test slow responses, 429, 500, DNS failure and certificate errors.`
  },
  {
    id:"14", title:"IBM MQ and MFT Integration: Reliable Message and File Exchange", slug:"ibm-mq-mft-mulesoft-integration",
    excerpt:"Understand queue-based decoupling, message acknowledgement, replay and managed file transfer considerations.",
    category:"Enterprise Integration", published_at:"2026-11-09", reading_minutes:7,
    content:`# IBM MQ and managed file transfer patterns

Queues and managed file transfer solve different but complementary integration problems. A queue carries discrete messages; MFT coordinates controlled file exchange with delivery, routing and operational visibility.

## Why use a queue?

A producer can publish a message without waiting for the consumer to finish its work. This decouples systems and absorbs temporary traffic spikes. The consumer processes messages at its own pace.

## Acknowledge only after safe processing

If a consumer acknowledges before completing the business operation, a failure can lose work. If it acknowledges after processing but crashes before acknowledgement, the message may be delivered again. Therefore consumers should be idempotent.

## Poison messages

A message that repeatedly fails should not block the queue forever. Define a retry limit, backout queue or dead-letter process, alerting and a controlled replay procedure.

## MFT considerations

For file transfers, agree on naming, encryption, checksums, completion markers, duplicate handling, retention, archival and reconciliation. A file appearing in a directory does not always mean the sender has finished writing it.

## MuleSoft checklist

Confirm queue manager connectivity, channel and TLS settings, credentials, message format, acknowledgement mode, retry policy and monitoring. For MFT, confirm partner routing, file completion semantics and delivery evidence. Never put production secrets in source control.`
  },
  {
    id:"15", title:"Mule 4 Performance: Streaming, Batch and Database Pooling", slug:"mule4-performance-streaming-batch-db-pooling",
    excerpt:"Choose a processing strategy for large payloads and tune database access without overwhelming dependencies.",
    category:"Performance", published_at:"2026-11-09", reading_minutes:8,
    content:`# Mule 4 performance: start with the workload

Performance tuning begins with measurement. Understand payload size, record count, arrival rate, latency objective, dependency limits and memory available to the runtime.

## Streaming

Streaming can reduce memory pressure when processing large data sets. Choose repeatable or non-repeatable streaming behavior based on whether the flow needs to read the stream more than once. Avoid converting a huge stream into an in-memory array without a reason.

## Batch processing

Batch jobs are useful for large record-oriented workloads that need record-level processing and reporting. Design for partial failures, retries, ordering requirements and restart behavior. Do not assume that one failed record should always fail the entire batch.

## Database connection pooling

A connection pool reuses database connections. Too small a pool can create wait time; too large a pool can overload the database. Tune pool size with the DBA and account for total replicas across the deployment, not just one Mule instance.

## Measure before changing

Track throughput, p95/p99 latency, heap and garbage collection, CPU, database wait time, pool usage, downstream response time and error rate. Change one variable at a time and compare under representative load.

## Practical checklist

- Paginate or stream large source data.
- Select only required columns.
- Use parameterized SQL and suitable indexes.
- Avoid unnecessary repeated transformations.
- Bound concurrency to dependency capacity.
- Set timeouts and backpressure behavior.
- Load-test realistic payload sizes and failure conditions.`
  }
];
