<template class="feeding_items">

    <v-table fixed-header density="compact" class="feeding_items__table">
        <thead>
        <tr class="feeding_items__table__new_item_row" v-show="items.length">
            <td colspan="4" class="text-center">{{ lastItemDiff }}</td>
        </tr>
        <tr>
            <th class="text-left">Time</th>
            <th class="text-left">Diff</th>
            <th class="text-left">Side</th>
            <th>
                <v-checkbox-btn :indeterminate="checkedItems.length !== allDates.length && !!checkedItems.length"
                                :model-value="checkedItems.length === allDates.length && !!items.length"
                                :disabled="!items.length"
                                density="compact"
                                @change.stop="checkAllItems"
                />
            </th>
        </tr>
        </thead>
        <tbody>

        <template v-for="(item, key) in preparedItems">
            <tr v-if="item.firstDate" class="feeding_items__table__table_separator" :class="{ test_class: key === 60 }">
                <td colspan="4">
                    <span class="rounded">{{ item.formattedDate }}</span>
                </td>
            </tr>
            <tr>
                <td>{{ item.formattedTime }}</td>
                <td class="h-100">
                    {{ item.formattedDiffTime }}
                </td>
                <td class="text-uppercase">{{ item.side }}</td>
                <td>
                    <v-checkbox-btn density="compact" v-model="checkedItems" :value="item.date"/>
                </td>
            </tr>
        </template>

        <tr>
            <td colspan="4" style="height: 120px"></td>
        </tr>
        </tbody>
    </v-table>

    <v-dialog v-model="showAddFeedingItemModalForm">
        <feeding-item-form
            :date-time="Date.now()"
            :side="suggestSide"
            @close="showAddFeedingItemModalForm = false"
        />
    </v-dialog>

    <div class="feeding_items__action_buttons_block">
        <v-btn :theme="isDarkMode ? LIGHT_THEME_NAME : DARK_THEME_NAME"
               class="feeding_items__action_add_button"
               :class="{ __animated_shadow: suggestSide === 'l', 'feeding_items__action_buttons__hidden': !showActionAddButtons || !!checkedItems.length }"
               icon
               size="x-large"
               @click.stop="addItem(FEEDING_LEFT_SIDE_KEY)"
        >
            L
        </v-btn>
        <v-btn :theme="isDarkMode ? LIGHT_THEME_NAME : DARK_THEME_NAME"
               class="feeding_items__action_add_button"
               :class="{ __animated_shadow: suggestSide === 'r', 'feeding_items__action_buttons__hidden': !showActionAddButtons || !!checkedItems.length }"
               icon
               size="x-large"
               @click.stop="addItem(FEEDING_RIGHT_SIDE_KEY)"
        >
            R
        </v-btn>
        <v-btn class="feeding_items__action_remove_button"
               :class="{ feeding_items__action_buttons__hidden: !showActionRemoveButton, __transition_delay_0: !showActionAddButtons && feedingTableScrollService.scrolledDown.value }"
               :theme="isDarkMode ? LIGHT_THEME_NAME : DARK_THEME_NAME"
               color="error"
               size="x-large"
               :icon="mdiDeleteForever"
               @click.stop="removeItems"
        />
        <v-btn :theme="isDarkMode ? LIGHT_THEME_NAME : DARK_THEME_NAME"
               class="feeding_items__action_add_button"
               :class="{ 'feeding_items__action_buttons__hidden': !!checkedItems.length, 'feeding_items__action_buttons__hidden': !showActionAddButtons || !!checkedItems.length }"
               :icon="mdiPlus"
               size="x-large"
               @click.stop="showAddFeedingItemModalForm = true"
        />
    </div>

    <teleport to="#navigation_drawer_list_items_actions_end">
        <v-list-item nav :prepend-icon="mdiFileUploadOutline" :href="feedingItemsExportString" download="feeding_items.json" title="Export"/>
        <v-list-item nav :prepend-icon="mdiFileDownloadOutline" @click.prevent="drawImportDialog = true" :title="isImportInProcess ? 'Import in process...' : 'Import'"/>
    </teleport>

    <v-dialog v-model="drawImportDialog">
        <v-card class="mx-auto"
                max-width="500"
                width="100%"
        >
            <v-progress-linear :model-value="progress" bg-opacity="0.5" class="position-absolute"/>
            <v-card-title>
                <template v-if="isImportClear">Import file</template>
                <template v-else-if="isImportInProcess">In process...</template>
                <template v-else-if="isImportDone">Done</template>
            </v-card-title>
            <v-container>
                <v-form>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input label="Choose file"
                                          ref="fileInput"
                                          accept="application/json"
                                          :disabled="isImportInProcess"
                                          :rules="importRules"
                                          :errorMessages="validationErrorMessage"
                                          validate-on="input"
                            ></v-file-input>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>

            <v-divider />

            <v-card-actions>
                <v-spacer/>

                <v-btn :prepend-icon="mdiClose" :disabled="isImportInProcess" @click="drawImportDialog = false">Close</v-btn>
                <v-btn :prepend-icon="mdiChevronRight" @click.prevent="runImport" :disabled="!canImport || isImportInProcess">Import</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<style>

.feeding_items__table {
    height: calc(100vh - 77px);
    overflow-y: scroll;
}

.feeding_items__table table th {
    height: 60px !important;
}

.feeding_items__table table td, .feeding_items__table table th {
    padding: 8px !important;
    border-bottom: none !important;
    box-shadow: none !important;
}

.feeding_items__table__new_item_row {
    position: sticky;
    top: 0;
    z-index: 2;
    background: rgb(var(--v-theme-surface));
    height: 45px;
}

.feeding_items__table .feeding_items__table__table_separator {
    position: sticky;
    top: 40px;
    z-index: 2;
    height: 38px;
    border: none;
}

.feeding_items__table table .feeding_items__table__table_separator td {
    padding: 0 !important;
}

.feeding_items__table__table_separator td {
    border: none !important;
    text-align: center;
    height: 0 !important;
    padding: 0 !important;
}

.feeding_items__table__table_separator td:before {
    content: '';
    width: 100%;
    height: 0;
    left: 0;
    top: 19px;
    position: absolute;
    border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
    box-sizing: border-box;
}

.feeding_items__table__table_separator td span {
    border: 1px solid rgb(var(--v-theme-surface-variant));
    padding: 3px 10px;
    top: 4px;
    background: rgb(var(--v-theme-surface));
    position: absolute;
    transform: translateX(-50%);
    width: 120px;
    text-align: center;
}

.feeding_items__action_buttons_block {
    position: fixed;
    bottom: 50px;
    left: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    transition: all .3s ease;
    z-index: 2;
}


.feeding_items__action_buttons__hidden {
    transform: translateY(150px);
}

.feeding_items__action_add_button,
.feeding_items__action_remove_button {
    margin: 0 10px;
}

.feeding_items__action_add_button:nth-child(2) {
    transition-delay: .1s;
}

.feeding_items__action_add_button:last-child {
    transition-delay: .2s;
}

.feeding_items__action_remove_button {
    margin-left: -74px;
    transition-delay: .2s;
}

.feeding_items__action_remove_button.feeding_items__action_buttons__hidden {
    transition-delay: 0s;
}

.__transition_delay_0 {
    transition-delay: 0s !important;
}

.feeding_items__action_add_button.__animated_shadow::before {
    position: absolute;
    content: '';
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(100%);
    margin: 0 auto;
    background: transparent;
    z-index: -1;
    height: 100%;
    opacity: 1;
    width: 100%;
    border: none;
    box-shadow: inset 0 0 20px 3px rgb(var(--v-theme-surface));
    border-radius: 100%;

    -webkit-animation: impulse 1.5s ease-out infinite;
    -moz-animation: impulse 1.5s ease-out infinite;
    -o-animation: impulse 1.5s ease-out infinite;
    animation: impulse 1.5s ease-out infinite;
}

@keyframes impulse {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(100%);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(150%);
    }
}

@-webkit-keyframes impulse {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(100%);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(150%);
    }
}

@-moz-keyframes impulse {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(100%);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(150%);
    }
}

@-o-keyframes impulse {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(100%);
    }

    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(150%);
    }
}

</style>

<script setup>

// import components
import FeedingItemForm from '@/components/FeedingItemForm.vue'

// import vue
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// import services
import duration from 'dayjs/plugin/duration'
import { useThemeService } from '@/services/useThemeService';
import { useScrollService } from '@/services/useScrollService'
import { useFeedingItemsService } from '@/services/useFeedingItemsService';
import { useFeedingItemsImportService } from '@/services/useFeedingItemsImportService';
import {
    mdiDeleteForever,
    mdiPlus,
    mdiFileDownloadOutline,
    mdiFileUploadOutline,
    mdiClose,
    mdiChevronRight
} from '@mdi/js'

import dayjs from 'dayjs'

dayjs.extend(duration)

// import store
import { useFeedingItemsStore } from '@/stores/useFeedingItemsStore'

// use
const feedingTableScrollService = useScrollService()
const feedingItemsStore = useFeedingItemsStore()

// refs
const { items } = storeToRefs(feedingItemsStore)
const fileInput = ref()

const {
    canImport,
    validationErrorMessage,
    isImportClear,
    isImportInProcess,
    isImportDone,
    progress,
    validateImportFile,
    runImport,
    breakProcess,
} = useFeedingItemsImportService()

const {
    FEEDING_LEFT_SIDE_KEY,
    FEEDING_RIGHT_SIDE_KEY,
    preparedItems,
    suggestSide,
    allDates,
    checkedItems,
    lastItemDiff,
    exportString: feedingItemsExportString,
    addItem,
    removeItems,
    checkAllItems,
} = useFeedingItemsService()

const { isDarkMode, DARK_THEME_NAME, LIGHT_THEME_NAME } = useThemeService()

// data
const showAddFeedingItemModalForm = ref(false)
const drawImportDialog = ref(false)

// computed
const showActionAddButtons = computed(() => !feedingTableScrollService.scrolledDown.value && !checkedItems.value.length)
const showActionRemoveButton = computed(() => !!checkedItems.value.length)

// rules
const importRules = [
    value => !value || !value.length || validateImportFile(value) || validationErrorMessage
]

onMounted(() => {
    feedingTableScrollService.addEventListener(document.querySelector('.v-table__wrapper'))
})

onBeforeUnmount(() => {
    feedingTableScrollService.removeEventListener(document.querySelector('.v-table__wrapper'))
})

watch(isImportDone, (value) => {
    if (!!value) {
        fileInput.value.reset()
    }
})

watch(drawImportDialog, (value) => {
    if (!value && !isImportInProcess) {
        setTimeout(breakProcess, 1000)
    }
})

</script>
