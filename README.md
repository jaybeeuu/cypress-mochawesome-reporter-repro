# Cypress Mochawesome Reporter Repro

[Cypress Issue #16296](https://github.com/cypress-io/cypress/issues/16296)

The [mochawesome](https://docs.cypress.io/guides/tooling/reporters#Installed-via-npm) reporter is really useful.
However when used to report the results of a cypress test suite it incorrectly reports skipped tests.
This repository demonstrates teh problem.

Clone this repo and run the following commands:

```sh
pnpm install
pnpm test
```

The repo contains 2 describe blocks in `cypress/integration/skipped.spec.js`.
One is skipped with `xdecribe` the other `describe.skip`.
Each containing 3 `it` tests.
Cypress correctly reports the following in the console:

```sh
  ┌───────────────────────────────┐
  │ Tests:        6               │
  │ Passing:      0               │
  │ Failing:      0               │
  │ Pending:      6               │
  │ Skipped:      0               │
  │ Screenshots:  0               │
  │ Video:        true            │
  │ Duration:     0 seconds       │
  │ Spec Ran:     skipped.spec.js │
  └───────────────────────────────┘
```
However this disagrees with the report created by mochawesome.
In `.report/mochawesome.json` the `stats` key of that `json` file will contain the following values:

```json
{
  "stats": {
    "suites": 2,
    "tests": 2,
    "passes": 0,
    "pending": 6,
    "failures": -4,
    "testsRegistered": 6,
    "other": 4,
    "skipped": 4,
  }
}
```

Notice that the `failures` count is `-4`.

It does appear that this is a problem with the way `cypress` works rather than `mochawesome` or `mocha`.
This is demonstrated by running

```sh
pnpm mocha-test
```

This will run the same spec file, but with mocha.
Mocha reports:

```sh
  Skipped
    - is skipped
    - is also skipped
    - is skipped too.

  XSkipped
    - is skipped
    - is also skipped
    - is skipped too.


  0 passing (7ms)
  6 pending
```

In the console. and the following in the `stats`key of `.report-mocha/mochawesome.json`.

```json
{
  "stats": {
    "suites": 2,
    "tests": 6,
    "passes": 0,
    "pending": 6,
    "failures": 0,
    "testsRegistered": 6,
    "other": 0,
    "skipped": 0
  }
}
```

The following appear to be the interesting parts of the logs (useing `DEBUG=cypress:*`):

```log
 cypress:server:project onMocha suite +6ms
  cypress:server:reporter got mocha event 'suite' with args: [ { id: 'r1', title: '', root: true, type: 'suite', file: 'cypress/integration/skipped.spec.js', retries: -1 } ] +6ms

  cypress:server:browsers:electron debugger: sending Page.screencastFrameAck with params { sessionId: 1 } +103ms
  cypress:server:browsers:electron debugger: received response to Page.screencastFrameAck: {} +0ms
  cypress:server:project onMocha suite +27ms
  Skipped
  cypress:server:reporter got mocha event 'suite' with args: [ { id: 'r2', title: 'Skipped', root: false, type: 'suite', file: null, invocationDetails: { function: 'Object../cypress/integration/skipped.spec.js', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 3, column: 10, whitespace: '    ' }, retries: -1 } ] +28ms
  cypress:server:project onMocha test:before:run +1ms
  cypress:server:reporter got mocha event 'test:before:run' with args: [ { id: 'r3', order: 1, title: 'is skipped', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile:
 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 4, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha pending +1ms
  cypress:server:reporter got mocha event 'pending' with args: [ { id: 'r3', order: 1, title: 'is skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 4, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +1ms
    - is skipped
  cypress:server:project onMocha test +0ms
  cypress:server:reporter got mocha event 'test' with args: [ { id: 'r3', order: 1, title: 'is skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 4, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test:after:run +0ms
  cypress:server:reporter got mocha event 'test:after:run' with args: [ { id: 'r3', order: 1, title: 'is skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 4, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha test:before:run +1ms
  cypress:server:reporter got mocha event 'test:before:run' with args: [ { id: 'r4', order: 2, title: 'is also skipped', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 8, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha pending +0ms
  cypress:server:reporter got mocha event 'pending' with args: [ { id: 'r4', order: 2, title: 'is also skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 8, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
    - is also skipped
    - is skipped too.
  cypress:server:project onMocha test +0ms
  cypress:server:reporter got mocha event 'test' with args: [ { id: 'r4', order: 2, title: 'is also skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 8, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test:after:run +1ms
  cypress:server:reporter got mocha event 'test:after:run' with args: [ { id: 'r4', order: 2, title: 'is also skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 8, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha test:before:run +0ms
  cypress:server:reporter got mocha event 'test:before:run' with args: [ { id: 'r5', order: 3, title: 'is skipped too.', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 12, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha pending +1ms
  cypress:server:reporter got mocha event 'pending' with args: [ { id: 'r5', order: 3, title: 'is skipped too.', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 12, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test +1ms
  cypress:server:reporter got mocha event 'test' with args: [ { id: 'r5', order: 3, title: 'is skipped too.', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 12, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha test end +0ms
  cypress:server:reporter got mocha event 'test end' with args: [ { id: 'r5', order: 3, title: 'is skipped too.', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 12, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test:after:run +1ms
  cypress:server:reporter got mocha event 'test:after:run' with args: [ { id: 'r5', order: 3, title: 'is skipped too.', state: 'pending', body: '', type: 'test', wallClockDuration: null, file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 12, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha suite end +6ms

  cypress:server:reporter got mocha event 'suite end' with args: [ { id: 'r2', title: 'Skipped', root: false, type: 'suite', file: null, invocationDetails: { function: 'Object../cypress/integration/skipped.spec.js', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 3, column: 10, whitespace: '    ' }, retries: -1 } ] +6ms
  cypress:server:project onMocha suite +1ms
  cypress:server:reporter got mocha event 'suite' with args: [ { id: 'r6', title: 'XSkipped', root: false, type: 'suite', file: null, invocationDetails: { function: 'Object../cypress/integration/skipped.spec.js', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 17, column: 1, whitespace: '    ' }, retries: -1 } ] +1ms
  cypress:server:project onMocha test:before:run +0ms
  XSkipped
    - is skipped
  cypress:server:reporter got mocha event 'test:before:run' with args: [ { id: 'r7', order: 4, title: 'is skipped', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile:
 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 18, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha pending +0ms
  cypress:server:reporter got mocha event 'pending' with args: [ { id: 'r7', order: 4, title: 'is skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 18, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test +1ms
  cypress:server:reporter got mocha event 'test' with args: [ { id: 'r7', order: 4, title: 'is skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 18, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha test:after:run +0ms
  cypress:server:reporter got mocha event 'test:after:run' with args: [ { id: 'r7', order: 4, title: 'is skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 18, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test:before:run +0ms
  cypress:server:reporter got mocha event 'test:before:run' with args: [ { id: 'r8', order: 5, title: 'is also skipped', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 22, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha pending +0ms
  cypress:server:reporter got mocha event 'pending' with args: [ { id: 'r8', order: 5, title: 'is also skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 22, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
    - is also skipped
    - is skipped too.

  cypress:server:project onMocha test +1ms
  cypress:server:reporter got mocha event 'test' with args: [ { id: 'r8', order: 5, title: 'is also skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 22, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha test:after:run +0ms
  cypress:server:reporter got mocha event 'test:after:run' with args: [ { id: 'r8', order: 5, title: 'is also skipped', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 22, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test:before:run +0ms
  cypress:server:reporter got mocha event 'test:before:run' with args: [ { id: 'r9', order: 6, title: 'is skipped too.', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 26, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha pending +0ms
  cypress:server:reporter got mocha event 'pending' with args: [ { id: 'r9', order: 6, title: 'is skipped too.', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 26, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test +0ms
  cypress:server:reporter got mocha event 'test' with args: [ { id: 'r9', order: 6, title: 'is skipped too.', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 26, column: 3, whitespace: '    ' }, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha suite end +1ms
  cypress:server:reporter got mocha event 'suite end' with args: [ { id: 'r6', title: 'XSkipped', root: false, type: 'suite', file: null, invocationDetails: { function: 'Object../cypress/integration/skipped.spec.js', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 17, column: 1, whitespace: '    ' }, retries: -1 } ] +0ms
  cypress:server:project onMocha test end +0ms
  cypress:server:reporter got mocha event 'test end' with args: [ { id: 'r9', order: 6, title: 'is skipped too.', state: 'pending', body: '', type: 'test', file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 26, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +0ms
  cypress:server:project onMocha test:after:run +0ms
  cypress:server:reporter got mocha event 'test:after:run' with args: [ { id: 'r9', order: 6, title: 'is skipped too.', state: 'pending', body: '', type: 'test', wallClockDuration: null, file: null, invocationDetails: { function: 'Suite.eval', fileUrl: 'http://localhost:63161/__cypress/tests?p=cypress\\integration\\skipped.spec.js', originalFile: 'webpack:///cypress/integration/skipped.spec.js', relativeFile: 'cypress/integration/skipped.spec.js', absoluteFile: 'C:\\dev\\src\\cypress-mochawesome-reporter-repro/cypress/integration/skipped.spec.js', line: 26, column: 3, whitespace: '    ' }, final: true, currentRetry: 0, retries: -1 } ] +1ms
  cypress:server:project onMocha suite end +1ms
  cypress:server:reporter got mocha event 'suite end' with args: [ { id: 'r1', title: '', root: true, type: 'suite', file: 'cypress/integration/skipped.spec.js', retries: -1 } ] +0ms
  cypress:server:project onMocha end +0ms
```