<script setup lang="ts">

const props = defineProps({
    navText: String,
    selected: Boolean
})

</script>

<template>
    <li v-if="!selected" class="hover:cursor-pointer select-none inline-block sp-3 px-8 py-1 mb-0 m-4 mt-2 text-xl bg-background-navbutton text-primary text-nowrap ">{{navText}}</li>
    <li v-else class="hover:cursor-pointer select-none inline-block sp-3 px-8 py-1 mb-0 m-4 mt-2 text-xl bg-background-navbutton text-primary text-nowrap  border-primary border border-b-0 z-10 ">{{navText}}</li>
</template>