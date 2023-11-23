# Sierra challenge

## Technical Decisions

### Tooling

I've decided to use Nodejs because given the history that
Barbara told me about the company Profile, nowadays you guys are
used to deliver MVPs and I think that there are some frameworks that are
mature, opinionated, with a great DX (fast to develop) and with years of
production ready that can help a lot with this goal.

So, with that being said, that's my motivation for using Nodejs and Nestjs on this challenge.

#### Other things that I've used

- Service and Repository Design Pattern
- TDD (focusing on e2e)
- ORM (applying the concepts of migrations and entities)
- Abstractions and Inheritance

### How to run it

1. Run the following on your terminal:

```shell
docker compose up --build
```

2. Go to localhost:3000/docs to open the interactive OpenAPI spec
3. Have fun :)
