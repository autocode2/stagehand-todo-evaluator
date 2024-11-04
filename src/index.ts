import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const stagehand = new Stagehand({
  env: "LOCAL",
});

const HAIKU_TODO_BASIC_URL = "https://autocode2.github.io/autocode-examples/examples/example-todo/blog/2024-08-01-introducing-react-todo/no_context/fixed_haiku/"
const NEW_SONNET_BASIC_URL = "https://autocode2.github.io/autocode-examples/examples/example-todo/blog/2024-10-24-new-sonnet/basic/sonnet-v2/"

await stagehand.init({
  modelName: 'gpt-4o-mini',
});
await stagehand.page.goto(HAIKU_TODO_BASIC_URL);
await stagehand.act({ action: "Add an item 'Buy eggs' to the todo list" });
await stagehand.act({ action: "Add an item 'Buy sausages' to the todo list" });
await stagehand.act({ action: "Add an item 'Buy bacon' to the todo list" });

let todoList = await stagehand.extract({
  instruction: "Extract the todo list",
  schema: z.object({
    items: z.array(z.object({ text: z.string(), completed: z.boolean() })),
    completedCount: z.number(),
    incompleteCount: z.number(),
  }),
});
console.log(todoList);

await stagehand.act({ action: "Mark 'Buy Sausages' as completed" });
todoList = await stagehand.extract({
  instruction: "Extract the todo list",
  schema: z.object({
    items: z.array(z.object({ text: z.string(), completed: z.boolean() })),
    completedCount: z.number(),
    incompleteCount: z.number(),
  }),
});
console.log(todoList);

process.exit(0);
