import { createServerFn } from "@tanstack/react-start";
import { addressIdInput, addressInput, loginInput, profileInput, registerInput, wishInput } from "./account-input";

export const readAccount = createServerFn({ method: "GET" }).handler(async () => {
  const { readAccount: read } = await import("./account.server");
  return read();
});

export const registerAccount = createServerFn({ method: "POST" })
  .validator((input: unknown) => registerInput.parse(input))
  .handler(async ({ data }) => {
    const { registerAccount: register } = await import("./account.server");
    return register(data);
  });

export const loginAccount = createServerFn({ method: "POST" })
  .validator((input: unknown) => loginInput.parse(input))
  .handler(async ({ data }) => {
    const { loginAccount: login } = await import("./account.server");
    return login(data);
  });

export const logoutAccount = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAccount: logout } = await import("./account.server");
  return logout();
});

export const saveProfile = createServerFn({ method: "POST" })
  .validator((input: unknown) => profileInput.parse(input))
  .handler(async ({ data }) => {
    const { saveProfile: save } = await import("./account.server");
    return save(data);
  });

export const addAddress = createServerFn({ method: "POST" })
  .validator((input: unknown) => addressInput.parse(input))
  .handler(async ({ data }) => {
    const { addAddress: add } = await import("./account.server");
    return add(data);
  });

export const removeAddress = createServerFn({ method: "POST" })
  .validator((input: unknown) => addressIdInput.parse(input))
  .handler(async ({ data }) => {
    const { removeAddress: remove } = await import("./account.server");
    return remove(data.id);
  });

export const removeWish = createServerFn({ method: "POST" })
  .validator((input: unknown) => wishInput.parse(input))
  .handler(async ({ data }) => {
    const { removeWish: remove } = await import("./account.server");
    return remove(data.sku);
  });
