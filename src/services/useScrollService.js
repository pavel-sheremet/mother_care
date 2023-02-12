import { ref } from 'vue'

export const useScrollService = () => {
    // data
    const scrolledDown = ref(false)
    const lastScrollPosition = ref(0)

    // actions
    const registerScroll = (e) => {
        scrolledDown.value = e.target.scrollTop > lastScrollPosition.value && lastScrollPosition.value > 0
        lastScrollPosition.value = e.target.scrollTop
    }

    const addEventListener = (element) => {
        element.addEventListener('scroll', registerScroll, false)
    }

    const removeEventListener = (element) => {
        element.removeEventListener('scroll', registerScroll, false)
    }

    return { addEventListener, removeEventListener, lastScrollPosition, scrolledDown }
}