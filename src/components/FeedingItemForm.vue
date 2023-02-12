<template>
    <v-card
        class="mx-auto"
        width="100%"
        title="Add item"
    >
        <v-container>
            <v-form ref="form">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            v-model="dateTime"
                            :rules="formRules.dateTime"
                            label="Date & Time"
                            variant="underlined"
                            type="datetime-local"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12">
                        <v-select
                            v-model="side"
                            :items="sides"
                            :rules="formRules.side"
                            item-title="name"
                            item-value="value"
                            label="Select side"
                            persistent-hint
                            single-line
                        ></v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>

        <v-divider />

        <v-card-actions>
            <v-spacer />

            <v-btn :prepend-icon="mdiClose" @click.prevent="emits('close')">Cancel</v-btn>
            <v-btn :prepend-icon="mdiChevronRight" @click.prevent="addItem">Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>

// import vue
import { ref, toRefs } from 'vue'

// import store
import { useFeedingItemsStore } from '@/stores/useFeedingItemsStore';

// import services
import { mdiChevronRight, mdiClose } from '@mdi/js'
import dayjs from 'dayjs';

// store
const feedingItemsStore = useFeedingItemsStore()

// emits
const emits = defineEmits(['close'])

// props
const props = defineProps({
    dateTime: Number,
    side: String
})

// props data
const { dateTime: dateTimeProp, side: sideProp } = toRefs(props)
const sides = [{ name: 'Left', value: 'l' }, { name: 'Right', value: 'r' }]

// data
const dateTime = ref(dayjs(dateTimeProp.value).format('YYYY-MM-DDTHH:mm:ss'))
const side = ref(sideProp.value)
const valid = ref(false)
const form = ref()

// rules
const formRules = {
    dateTime: [ value => !!value || 'Date & Time are required' ],
    side: [ value => !!value || 'Side is required' ]
}

// actions
const addItem = async () => {
    const validation = await form.value.validate()

    if (validation.valid === true) {
        feedingItemsStore.addItem(side.value, dayjs(dateTime.value).valueOf())
        emits('close')
    }
}

</script>
