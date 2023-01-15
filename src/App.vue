<template>
    <v-app>
        <v-navigation-drawer v-model="showNavigation">Navigation</v-navigation-drawer>

        <v-app-bar>
            <template v-slot:prepend>
                <v-app-bar-nav-icon @click.stop="showNavigation = !showNavigation"></v-app-bar-nav-icon>
            </template>

            <v-app-bar-title>Application</v-app-bar-title>
        </v-app-bar>

        <v-main>content</v-main>
    </v-app>
</template>

<script setup>

import { ref } from 'vue'

const showNavigation = ref(false)

</script>