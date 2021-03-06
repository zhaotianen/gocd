/*
* Copyright 2018 ThoughtWorks, Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import {MithrilViewComponent} from "jsx/mithril-component";
import * as m from "mithril";
import {Stream} from "mithril/stream";
import {User, Users} from "models/users/users";
import {FlashMessage, FlashMessageModel, MessageType} from "views/components/flash_message";
import {Table} from "views/components/table";
import {UsersActionsWidget} from "views/pages/users/user_actions_widget";

export interface Attrs {
  users: Stream<Users>;
  message: FlashMessageModel;
}

export class UsersTableWidget extends MithrilViewComponent<Attrs> {
  static headers(users: Users) {
    return [
      <input type="checkbox"
             checked={users.areAllUsersSelected()}
             onclick={users.toggleSelection.bind(users)}/>,
      "Username", "Display name", "Roles", "Admin", "Email", "Enabled"];
  }

  static userData(users: Users): any[][] {
    return users.list().map((user: User) => {
      return [
        <input type="checkbox" checked={user.checked()} onclick={() => user.checked(!user.checked())}/>,
        user.loginName,
        user.displayName,
        undefined,
        user.isAdmin ? "Yes" : "No",
        user.email,
        user.enabled ? "Yes" : "No"
      ];
    });
  }

  view(vnode: m.Vnode<Attrs>) {
    return <Table headers={UsersTableWidget.headers(vnode.attrs.users() as Users)}
                  data={UsersTableWidget.userData(vnode.attrs.users())}/>;
  }
}

export class UsersWidget extends MithrilViewComponent<Attrs> {
  view(vnode: m.Vnode<Attrs>) {
    let optionalMessage: JSX.Element | null = null;
    if (vnode.attrs.message.hasMessage()) {
      optionalMessage =
        <FlashMessage type={vnode.attrs.message.type as MessageType} message={vnode.attrs.message.message}/>;
    }

    return [
      optionalMessage,
      <UsersActionsWidget {...vnode.attrs} />,
      <UsersTableWidget {...vnode.attrs}/>
    ];
  }
}
