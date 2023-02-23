import { useFeedingItemsService } from '@/services/useFeedingItemsService';
import { computed, ref } from 'vue';

export const useFeedingItemsImportService = () => {
    const { addItems } = useFeedingItemsService()
    
    // constants
    // todo: try to do enum
    const FEEDING_ITEMS_IMPORT_STATUS_CLEAR = 'clear'
    const FEEDING_ITEMS_IMPORT_STATUS_IN_PROCESS = 'in_process'
    const FEEDING_ITEMS_IMPORT_STATUS_DONE = 'done'

    // data
    const importData = ref()
    const importDataLength = ref(0)
    const canImport = ref(false)
    const validationErrorMessage = ref('')
    const status = ref(FEEDING_ITEMS_IMPORT_STATUS_CLEAR)
    const progress = ref(0)

    // computed
    const isImportClear = computed(() => status.value === FEEDING_ITEMS_IMPORT_STATUS_CLEAR)
    const isImportInProcess = computed(() => status.value === FEEDING_ITEMS_IMPORT_STATUS_IN_PROCESS)
    const isImportDone = computed(() => status.value === FEEDING_ITEMS_IMPORT_STATUS_DONE)

    // actions
    const validateImportFile = async (files) => {
        breakProcess()

        await files[0].text()
            .then(text => {
                try {
                    const data = JSON.parse(text)

                    if (!Array.isArray(data)) {
                        throw new Error('Wrong data format')
                    }

                    data.forEach(item => {
                        if (!['side', 'date'].every(field => Object.keys(item).includes(field))) {
                            throw new Error('File items have no necessary field')
                        }
                    })

                    importData.value = data
                    importDataLength.value = importData.value.length
                    canImport.value = true
                } catch (e) {
                    breakProcess()

                    validationErrorMessage.value = e.message

                    return false
                }
            })

        return true
    }

    const runImport = () => {
        // https://learn.javascript.ru/event-loop#primer-1-razbienie-tyazhyoloy-zadachi
        setImportStatus(FEEDING_ITEMS_IMPORT_STATUS_IN_PROCESS)

        const chunkSize = 100

        addItems(importData.value.splice(0, chunkSize))

        progress.value = Math.round(Math.abs(importData.value.length - importDataLength.value) / importDataLength.value * 100)

        if (importData.value.length === 0) {
            setTimeout(() => {
                breakProcess(FEEDING_ITEMS_IMPORT_STATUS_DONE)
            }, 1000)
        } else {
            setTimeout(runImport)
        }
    }

    const setImportStatus = (value) => {
        switch (value) {
            case FEEDING_ITEMS_IMPORT_STATUS_DONE:
                status.value = value
                break

            case FEEDING_ITEMS_IMPORT_STATUS_IN_PROCESS:
                status.value = value
                break

            default:
                status.value = FEEDING_ITEMS_IMPORT_STATUS_CLEAR
        }
    }

    const breakProcess = (status) => {
        importData.value = null
        canImport.value = false
        validationErrorMessage.value = ''
        importDataLength.value = 0
        progress.value = 0

        setImportStatus(status)
    }
    
    return {
        canImport,
        validationErrorMessage,
        isImportClear,
        isImportInProcess,
        isImportDone,
        progress,
        validateImportFile,
        runImport,
        breakProcess,
    }
}