import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorageService } from '@/services/useLocalStorageService'

const FEEDING_ITEMS_STORAGE_KEY = 'feeding_items'

export const useFeedingItemsStore = defineStore('feeding', () => {
    // use
    const localStorage = useLocalStorageService()

    // data
    const items = ref(localStorage.get(FEEDING_ITEMS_STORAGE_KEY, []))

    // actions
    const addItem = (side, date) => {
        items.value.push({ date: date ?? Date.now(), side })

        localStorage.set(FEEDING_ITEMS_STORAGE_KEY, items.value)
    }

    const addItems = (data) => {
        items.value = items.value.concat(data)

        localStorage.set(FEEDING_ITEMS_STORAGE_KEY, items.value)
    }

    const removeItems = (dates = []) => {
        if (dates.length === items.value.length) {
            localStorage.remove(FEEDING_ITEMS_STORAGE_KEY)

            items.value = []

            return
        }

        dates.forEach((date) => {
            const index = items.value.findIndex((item) => item.date === date)

            items.value.splice(index, 1)
        })

        localStorage.set(FEEDING_ITEMS_STORAGE_KEY, items.value)
    }

    return { items, addItem, addItems, removeItems }
});