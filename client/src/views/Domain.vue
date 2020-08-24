<template>
  <MainLayout>
    <b-container>
      <b-row>
        <b-col>
          <h1>Intercepts</h1>
          <b-button
            v-b-modal.configure-intercept
            pill
            size="sm"
            class="mx-1"
          >
            New
          </b-button>
          <b-button
            v-b-modal.intercept-help
            pill
            variant="info"
            size="sm"
            class="mx-1"
          >
            Help
          </b-button>
          <b-table
            class="mt-4"
            stacked="md"
            striped
            :items="interceptTableData"
            :fields="interceptTableFields"
            :tbody-tr-class="rowClass"
            :busy="$store.getters['resource/domain/fetching']"
          >
            <div
              slot="table-busy"
              class="text-center text-danger my-2"
            >
              <LoadingIndicator />
            </div>

            <template
              v-slot:cell(response)="data"
            >
              <SelectResponseCell
                :options="data.item.options"
                :selected-response="user.data.intercepts[data.item.id]"
                @select="onSelectResponse(data.item.id, $event)"
              />
            </template>

            <template
              v-slot:cell(actions)="data"
            >
              <b-button
                size="sm"
                @click="toggleDetails(data)"
              >
                {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
              </b-button>&nbsp;
            </template>

            <template
              slot="row-details"
              slot-scope="row"
            >
              <b-alert
                variant="danger"
                :show="!row.item.locked"
              >
                <p><strong>This intercept is not currently locked</strong></p>
                <p>
                  When unlocked, conditions can be added to intercepts.  This is an unstable state.
                  Lock this intercept before using it.
                </p>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="onLockIntercept(row.item.id)"
                >
                  Lock
                </b-button>
              </b-alert>
              <b-alert
                variant="success"
                :show="row.item.locked"
              >
                This intercept is locked and conditions should be stable.
              </b-alert>
              <b-card no-body>
                <b-list-group>
                  <ConditionDetails
                    :conditions="row.item.conditions"
                    :locked="row.item.locked"
                    @add="onAddCondition(row.item.id)"
                    @delete="onDeleteCondition($event, row.item.id)"
                  />
                  <ResponseDetails
                    :responses="row.item.responses"
                    @add="onAddResponse(row.item.id)"
                    @select="onSelectResponse(row.item.id, $event)"
                  />
                </b-list-group>
              </b-card>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>

    <ConfigureIntercept :domain="domain" />
    <LockInterceptModal :intercept="selectedIntercept" />
    <ConfigureResponse :intercept="selectedIntercept" />
    <ConfigureCondition :intercept="selectedIntercept" />

    <b-modal
      id="intercept-help"
      title="Intercept help"
      header-bg-variant="info"
      header-text-variant="light"
      hide-footer
    >
      <InterceptHelp :title="false" />
    </b-modal>
    <b-modal
      id="condition-help"
      title="Condition help"
      header-bg-variant="info"
      header-text-variant="light"
      hide-footer
    >
      <ConditionHelp :title="false" />
    </b-modal>
    <b-modal
      id="response-help"
      title="response help"
      header-bg-variant="info"
      header-text-variant="light"
      hide-footer
    >
      <ResponseHelp :title="false" />
    </b-modal>
  </MainLayout>
</template>

<script lang="ts">
import ConditionHelp from '@client/components/help/Conditions.vue';
import InterceptHelp from '@client/components/help/Intercepts.vue';
import ResponseHelp from '@client/components/help/Responses.vue';
import LoadingIndicator from '@client/components/LoadingIndicator.vue';
import ConfigureCondition from '@client/components/modal/ConfigureCondition.vue';
import ConfigureIntercept from '@client/components/modal/ConfigureIntercept.vue';
import ConfigureResponse from '@client/components/modal/ConfigureResponse.vue';
import LockInterceptModal from '@client/components/modal/LockIntercept.vue';

import ConditionDetails from '@client/components/page/domain/table/ConditionDetails.vue';
import ResponseDetails from '@client/components/page/domain/table/ResponseDetails.vue';
import SelectResponseCell from '@client/components/page/domain/table/SelectResponseCell.vue';

import MainLayout from '@client/layouts/Main.vue';
import { Intercept } from '@server/resources/intercept';
import { Condition } from '@server/resources/condition';
import { Response } from '@server/resources/response';
import { DomainMixin, UserMixin } from '@client/mixins';

import mixins from 'vue-typed-mixins';

interface HydratedIntercept extends Intercept {
  conditions: Condition[];
  responses: Response[];
}

export interface InterceptRowOption {
  text: string;
  value: string;
}

interface InterceptRowResponse extends Partial<Response> {
  isActive: boolean;
}

interface InterceptRow {
  _showDetails: boolean;
  conditions: Condition[];
  id: string;
  locked: boolean;
  name: string;
  options: InterceptRowOption[];
  responses: InterceptRowResponse[];
  totalConditions: number;
  totalResponses: number;
}

export default mixins(UserMixin, DomainMixin).extend({
  name: 'Domain',

  components: {
    ConditionDetails,
    ConditionHelp,
    ConfigureCondition,
    ConfigureIntercept,
    ConfigureResponse,
    InterceptHelp,
    LoadingIndicator,
    LockInterceptModal,
    MainLayout,
    ResponseDetails,
    ResponseHelp,
    SelectResponseCell,
  },

  data() {
    return {
      state: {
        fetching: {
          condition: false,
          response: false,
        },
        initialized: false,
        selected: {
          intercept: '',
        },
        toggledRow: '',
      },

      interceptTableFields: [
        { key: 'locked', label: 'Locked', formatter: (value: boolean) => (value ? '✅' : '❌') },
        {
          key: 'name', label: 'Name', sortable: true, sortDirection: 'asc',
        },
        {
          key: 'id', label: 'ID', sortable: true, sortDirection: 'asc',
        },
        { key: 'totalResponses', label: 'Available Responses' },
        { key: 'response', label: 'Activated Response' },
        { key: 'totalConditions', label: 'Total conditions' },
        { key: 'actions', label: 'Actions', class: 'text-right' },
      ],
    };
  },

  computed: {
    selectedIntercept(): Intercept | null {
      return this.$store.getters['resource/intercept/item'](this.state.selected.intercept);
    },

    hydratedIntercepts(): HydratedIntercept[] {
      if (!this.state.initialized) { return []; }

      return this.domain.data.intercepts.map((id) => {
        const intercept = this.$store.getters['resource/intercept/item'](id);

        if (!intercept) {
          throw new Error('Things are broken, missing a intercept');
        }
        const responses = intercept.data.responses.map((rid: string) => this.$store.getters['resource/response/item'](rid));
        const conditions = intercept.data.conditions.map((cid: string) => this.$store.getters['resource/condition/item'](cid));

        return {
          ...intercept,
          conditions,
          responses,
        };
      });
    },

    interceptTableData(): InterceptRow[] {
      const res = this.hydratedIntercepts

        .map((intercept: HydratedIntercept): InterceptRow => ({
          _showDetails: this.state.toggledRow === intercept.id,
          conditions: intercept.conditions,
          id: intercept.id,
          locked: !!intercept.data.locked,
          name: intercept.data.name,
          options: intercept.responses.map((response) => ({
            text: response.data.name,
            value: response.id,
          })),
          responses: intercept.responses.map((r: Response) => ({
            ...r,
            isActive: this.user.data.intercepts[intercept.id] === r.id,
          })),
          totalConditions: intercept.conditions.length,
          totalResponses: intercept.responses.length,
        }));

      return res;
    },
  },

  async created() {
    await this.$store.dispatch('resource/domain/hydrate', this.domain);
    this.state.initialized = true;
  },

  methods: {
    toggleDetails(row: { item: InterceptRow }) {
      // We are not using bootstrap-vues built in `row.toggleDetails()` as
      // it does not play well with computed getters.  It will not persist
      // the open row on data change.
      this.state.toggledRow = row.item._showDetails ? '' : row.item.id;
    },

    rowClass(item: InterceptRow) {
      if (!item) { return ''; }
      if (item.responses.some((response: InterceptRowResponse) => response.isActive)) {
        return 'table-info';
      }
      return '';
    },

    onSelectResponse(intercept: Intercept, response: Response) {
      this.$store.dispatch('resource/user/selectResponse', {
        intercept,
        response,
        user: this.user.id,
      });
    },

    onAddResponse(interceptId: string) {
      this.state.selected.intercept = interceptId;
      this.$bvModal.show('response-configuration');
    },

    onAddCondition(interceptId: string) {
      this.state.selected.intercept = interceptId;
      this.$bvModal.show('condition-configuration');
    },

    async onDeleteCondition(conditionId: string, interceptId: string) {
      await this.$store.dispatch('resource/condition/remove', conditionId);
      await this.$store.dispatch('resource/condition/get', interceptId);
    },

    async onLockIntercept(interceptId: string) {
      this.state.selected.intercept = interceptId;
      this.$bvModal.show('lock-intercept');
    },
  },

});
</script>
