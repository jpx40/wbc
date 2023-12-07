import { define, store, html } from "hybrids";
import { addCartItem } from "./store.js";

addCartItem({});

define({
  tag: "user-details",
  user: store(User),
  render: ({ user }) => html`
    <div>
      ${store.pending(user) && `Loading...`}
      ${store.error(user) && `Something went wrong...`}
      ${store.ready(user) && html` <p>${user.firstName} ${user.lastName}</p> `}
    </div>
  `,
});
