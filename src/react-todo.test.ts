import { Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

const stagehand = new Stagehand({
  env: "LOCAL",
  verbose: 0,
});

const HAIKU_TODO_BASIC_URL = "https://autocode2.github.io/autocode-examples/examples/example-todo/blog/2024-08-01-introducing-react-todo/no_context/fixed_haiku/"
const NEW_SONNET_BASIC_URL = "https://autocode2.github.io/autocode-examples/examples/example-todo/blog/2024-10-24-new-sonnet/basic/sonnet-v2/"

function addItem(name: string) {
  return stagehand.act({ action: `Add an item '${name}' to the todo list` });
}

function extractTodoList() {
  return stagehand.extract({
    instruction: "Extract the todo list",
    schema: z.object({
      items: z.array(z.object({ text: z.string(), completed: z.boolean() })),
      completedCount: z.number(),
      incompleteCount: z.number(),
    }),
  });
}

function markAsCompleted(name: string) {
  return stagehand.act({ action: `Mark '${name}' as completed`, useVision: true });
}

beforeAll(async () => {
  await stagehand.init({
    modelName: 'gpt-4o-mini',
  });
})

describe('Adding Items', () => {
  beforeEach(async () => {
    await stagehand.page.goto(NEW_SONNET_BASIC_URL);
  })

  test("can add items to the list", async () => {
    await addItem("Buy eggs");
    await addItem("Buy sausages");

    let todoList = await extractTodoList();
    expect(todoList.items).toHaveLength(2);
    expect(todoList.items[0].text).toEqual("Buy eggs");
    expect(todoList.items[1].text).toEqual("Buy sausages");
    expect(todoList.incompleteCount).toEqual(2);
    expect(todoList.completedCount).toEqual(0);
  }, 180 * 1000);

  test("can mark items as completed", async () => {
    await addItem("Buy eggs");
    await addItem("Buy sausages");

    await markAsCompleted("Buy sausages");
    let todoList = await extractTodoList();
    expect(todoList.items).toHaveLength(2);
    expect(todoList.items[0].text).toEqual("Buy eggs");
    expect(todoList.items[1].text).toEqual("Buy sausages");
    expect(todoList.items[1].completed).toEqual(true);
    expect(todoList.incompleteCount).toEqual(1);
    expect(todoList.completedCount).toEqual(1);
  }, 180 * 1000);
});

