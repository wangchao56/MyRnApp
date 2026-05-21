import { types, Instance, flow } from 'mobx-state-tree';

export const UserModel = types.model('User', {
  id: types.identifier,
  name: types.string,
  email: types.string,
  avatar: types.maybe(types.string),
  token: types.maybe(types.string),
});

export type UserType = Instance<typeof UserModel>;
