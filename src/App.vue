<template>
    <v-app>
        <navigation />

        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>

import Navigation from '@/components/Navigation.vue'

</script>