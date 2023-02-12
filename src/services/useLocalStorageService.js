const APP_STORAGE_PREFIX = 'mother_care_app__'

export const useLocalStorageService = () => {
    const get = (key, defaultValue = null) => JSON.parse(localStorage.getItem(APP_STORAGE_PREFIX.concat(key))) ?? defaultValue
    const set = (key, value) => localStorage.setItem(APP_STORAGE_PREFIX.concat(key), JSON.stringify(value))
    const remove = (key) => localStorage.removeItem(APP_STORAGE_PREFIX.concat(key))

    return { get, set, remove }
}