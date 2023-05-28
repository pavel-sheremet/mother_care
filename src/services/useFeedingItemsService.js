import { useFeedingItemsStore } from '@/stores/useFeedingItemsStore';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

export const useFeedingItemsService = () => {
    // constants
    const FEEDING_LEFT_SIDE_KEY = 'l'
    const FEEDING_RIGHT_SIDE_KEY = 'r'
    const FEEDING_MANUAL_SIDE_KEY = 'm'

    // use
    const feedingItemsStore = useFeedingItemsStore()

    // refs
    const { items: storeItems } = storeToRefs(feedingItemsStore)

    // data
    const checkedItems = ref([])
    const lastItemDiff = ref('')

    // computed
    const exportString = computed(() => "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storeItems.value)))
    const allDates = computed(() => storeItems.value.map((item) => item.date))

    const suggestSide = computed(() => {
        if (!storeItems.value.length) {
            return null
        }

        let i = 0

        while (storeItems.value[i].side === FEEDING_MANUAL_SIDE_KEY) {
            i++
        }

        return storeItems.value[i].side === FEEDING_RIGHT_SIDE_KEY ? FEEDING_LEFT_SIDE_KEY : FEEDING_RIGHT_SIDE_KEY
    })

    const preparedItems = computed(() => {
        return storeItems.value
            .sort((a, b) => b.date - a.date)
            .map((item, index, array) => {
                const prevIndex = index + 1 < array.length ? index + 1 : index
                const nextIndex = index - 1 >= 0 ? index - 1 : index
                const prev = array[prevIndex]
                const next = array[nextIndex]

                const itemDate = dayjs(item.date)
                const diff = itemDate.diff(prev.date)

                return {
                    ...item,
                    formattedTime: itemDate.format('HH:mm:ss'),
                    formattedDateTime: itemDate.format('DD.MM.YYYY HH:mm:ss'),
                    formattedDiffTime: dayjs.duration(diff).format('HH:mm:ss'),
                    formattedDate: itemDate.format('DD.MM.YYYY'),
                    firstDate: index === 0 || dayjs(item.date).date() !== dayjs(next.date).date()
                }
            })
    })

    // actions
    const addItem = (side, date) => { feedingItemsStore.addItem(side, date) }
    const addItems = (items) => { feedingItemsStore.addItems(items) }

    const removeItems = () => {
        feedingItemsStore.removeItems(checkedItems.value)
        checkedItems.value = []
    }

    const checkAllItems = () => {
        if (allDates.value.length === checkedItems.value.length) {
            checkedItems.value = []

            return
        }

        checkedItems.value = allDates.value
    }

    const getLastItemDiff = (format) => {
        if (!storeItems.value.length) {
            return
        }

        const diff = dayjs.duration(dayjs().diff(storeItems.value[0].date))

        return format ? diff.format(format) : diff
    }

    onMounted(() => {
        setInterval(() => { lastItemDiff.value = getLastItemDiff('HH:mm:ss') }, 500)
    })

    return {
        FEEDING_LEFT_SIDE_KEY,
        FEEDING_RIGHT_SIDE_KEY,
        FEEDING_MANUAL_SIDE_KEY,
        preparedItems,
        exportString,
        suggestSide,
        allDates,
        checkedItems,
        lastItemDiff,
        addItem,
        addItems,
        removeItems,
        checkAllItems,
        getLastItemDiff,
    }
}