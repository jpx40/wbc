import { define, parent, html } from "hybrids";

const MyParent = define({
  tag: "my-parent",
  count: 0,
});

define({
  tag: "my-element",
  ref: parent(MyParent),
  render: ({ ref }) => html`<div>count: ${ref.count}</div> `.css`
    div { color: white }
  `,
});
