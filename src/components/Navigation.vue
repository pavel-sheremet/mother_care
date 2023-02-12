<template>

    <v-app-bar density="compact" title="Mother Care">
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click.stop="drawNavigation = !drawNavigation"></v-app-bar-nav-icon>
        </template>
    </v-app-bar>

    <v-navigation-drawer temporary v-model="drawNavigation">
        <v-list density="compact" nav>
            <v-list-item :prepend-icon="mdiHome" :to="{ name: 'home' }" title="Home" />
            <v-divider />
        </v-list>
        <v-list density="compact" nav id="navigation_drawer_list_items_actions_end">
            <v-list-item :prepend-icon="isDarkMode ? mdiWeatherNight : mdiWeatherSunny" @click="toggleTheme" title="Toggle Theme" />
        </v-list>
    </v-navigation-drawer>

</template>

<script setup>

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { mdiWeatherNight, mdiWeatherSunny, mdiHome } from '@mdi/js'
import { useThemeService } from '@/services/useThemeService';

// use
const themeService = useThemeService()
const route = useRoute()

// refs
const { isDarkMode, toggleTheme } = themeService

// data
const drawNavigation = ref()

</script>