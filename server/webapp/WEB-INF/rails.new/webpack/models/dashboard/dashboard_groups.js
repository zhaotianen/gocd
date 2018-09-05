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

const _ = require('lodash');

class Group {

  constructor({name, can_administer, pipelines}) { // eslint-disable-line camelcase
    this.name          = name;
    this.canAdminister = can_administer; // eslint-disable-line camelcase
    this.pipelines     = pipelines;
  }

  resolvePipelines(resolver) {
    return _.map(this.pipelines, (pipelineName) => resolver.findPipeline(pipelineName));
  }

  select(filter) {
    const pipelines = _.filter(this.pipelines, filter);
    if (pipelines.length === 0) {
      return false;
    }
    return new Group({name: this.name, can_administer: this.canAdminister, pipelines}); // eslint-disable-line camelcase
  }

  label() {
    return "";
  }

  tooltipForEdit() {
    return "";
  }

  ariaLabelForEdit() {
    return "";
  }

  titleForEdit() {
    if (this.canAdminister) {
      return `Edit ${this.label()}`;
    }
    return "";
  }
}

class PipelineGroup extends Group {
  label() {
    return `Pipeline Group '${this.name}'`;
  }

  tooltipForEdit() {
    if (!this.canAdminister) {
      return "You don't have permission to edit this pipeline group";
    }
    return "";
  }

  ariaLabelForEdit() {
    return this.tooltipForEdit() || `Edit ${this.label()}`;
  }

  titleForEdit() {
    if (this.canAdminister) {
      return `Edit ${this.label()}`;
    }
    return "";
  }

  select(filter) {
    const pipelines = _.filter(this.pipelines, filter);
    if (pipelines.length === 0) {
      return false;
    }
    return new PipelineGroup({name: this.name, can_administer: this.canAdminister, pipelines}); // eslint-disable-line camelcase
  }
}

class Environment extends Group {
  label() {
    return `Environment '${this.name}'`;
  }

  tooltipForEdit() {
    if (!this.canAdminister) {
      return "You don't have permission to edit this environment";
    }
    return "";
  }

  ariaLabelForEdit() {
    return this.tooltipForEdit() || `Edit ${this.label()}`;
  }

  titleForEdit() {
    if (this.canAdminister) {
      return `Edit ${this.label()}`;
    }
    return "";
  }

  select(filter) {
    const pipelines = _.filter(this.pipelines, filter);
    if (pipelines.length === 0) {
      return false;
    }
    return new Environment({name: this.name, can_administer: this.canAdminister, pipelines}); // eslint-disable-line camelcase
  }
}

function DashboardGroups(groups) {
  this.groups = groups;

  this.select = (filter) => {
    return new DashboardGroups(_.compact(_.map(this.groups, (group) => {
      return group.select(filter);
    })));
  };
}

DashboardGroups.fromPipelineGroupsJSON = (json) => {
  return new DashboardGroups(_.map(json, (group) => new PipelineGroup(group)));
};

DashboardGroups.fromEnvironmentsJSON = (json) => {
  return new DashboardGroups(_.map(json, (group) => new Environment(group)));
};

DashboardGroups.Group = Group;

module.exports = DashboardGroups;
