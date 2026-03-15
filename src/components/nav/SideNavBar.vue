<script lang="ts" setup>
import IconBarChart from '../../assets/icons/IconBarChart.vue'
import IconOffice from '../../assets/icons/IconOffice.vue'
import IconHardwareChip from '../../assets/icons/IconHardwareChip.vue'

const props = defineProps<{
    selectedHref?: string
}>()

interface NavBarItem
{
    name: string,
    href: string,
    icon: string
}

const navBarItems : NavBarItem[] = [
    {
        name: "Overview",
        href: "#overview",
        icon: "overview"
    },
    {
        name: "Experience",
        href: "#experience",
        icon: "experience"
    },
    {
        name: "Skills",
        href: "#skills",
        icon: "skills"
    },
]


</script>

<template>

    <!-- Desktop side nav -->
    <div class="h-screen fixed w-16 hidden md:block z-40">
        <div class="flex h-full w-full items-center justify-center flex-col ">

        <div class="w-full h-full flex items-center justify-center flex-col bg-studio-1000 border border-l-0 border-accent bg-gradient-to-t from-studio-400 to-studio-300 dark:from-purple-900 dark:to-studio-1000 opacity-90 backdrop-blur-sm">
            <template v-for="i in navBarItems" :key="i.name">

                <div class="w-12 h-12 mb-4 group relative">
                    <a :href="i.href" :title="i.name" class="flex items-center justify-center w-full h-full transition-all duration-200
                      border-2 border-purple-600 hover:bg-primary dark:hover:bg-primary hover:stroke-accent hover:fill-accent dark:bg-studio-800
                      bg-studio-50 stroke-primary fill-primary rounded-lg" :class=" selectedHref === i.href ? 'bg-purple-400 dark:bg-purple-400 dark:stroke-studio-300 dark:fill-studio-300 stroke-purple-700 fill-purple-700 shadow-glow shadow-primary' : 'shadow-glow-sm shadow-purple-600'">
                        <IconBarChart v-if="i.icon === 'overview'" class="w-[75%] h-[75%] "></IconBarChart>
                        <IconOffice v-if="i.icon === 'experience'" class="w-[75%] h-[75%] "></IconOffice>
                        <IconHardwareChip v-if="i.icon === 'skills'" class="w-[75%] h-[75%] "></IconHardwareChip>
                    </a>
                    <!-- Tooltip -->
                    <div class="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-studio-900 dark:bg-studio-100 text-studio-100 dark:text-studio-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap font-lekton">
                        {{ i.name }}
                    </div>
                </div>

            </template>
        </div>
        </div>
	</div>

    <!-- Mobile bottom nav -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-accent/40 bg-studio-200/80 dark:bg-studio-1000/80 backdrop-blur-md">
        <div class="flex items-center justify-around py-2 px-4">
            <template v-for="i in navBarItems" :key="i.name">
                <a :href="i.href" :title="i.name" class="flex items-center justify-center w-10 h-10 transition-all duration-200
                    border border-purple-600/60 hover:bg-primary dark:hover:bg-primary hover:stroke-accent hover:fill-accent dark:bg-studio-800
                    bg-studio-50 stroke-primary fill-primary rounded-lg" :class="selectedHref === i.href ? 'bg-purple-400 dark:bg-purple-400 shadow-glow-sm shadow-primary' : ''">
                    <IconBarChart v-if="i.icon === 'overview'" class="w-[60%] h-[60%]"></IconBarChart>
                    <IconOffice v-if="i.icon === 'experience'" class="w-[60%] h-[60%]"></IconOffice>
                    <IconHardwareChip v-if="i.icon === 'skills'" class="w-[60%] h-[60%]"></IconHardwareChip>
                </a>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
</style>