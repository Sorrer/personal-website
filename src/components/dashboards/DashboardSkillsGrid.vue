<script setup lang="ts">
const props = defineProps<{
    items : string[]
}>();

</script>


<template>
    <div class="w-full h-fit flex flex-wrap justify-center items-center">
        <template v-for="i,j in items" :key="j">
            <div class="bg-studio-100 dark:bg-gradient-to-tr dark:from-studio-975 dark:to-studio-1050  border-studio-400 border-2 dark:border-studio-950 rounded-lg w-32 p-2 m-2 dark:text-[white] basis-1/6">
                {{ i }}
            </div>
        </template>
    </div>
            <!-- <div class="relative w-40 h-40 m-4 flex items-center justify-center ">
                <IconHexagon class="absolute w-full h-full fill-purple-600 stroke-purple-900 drop-shadow-glow shadow-purple-100 "></IconHexagon>
                <div class="z-10">
                    {{ i }}
                </div>
            </div> -->
</template>

<style>
</style>