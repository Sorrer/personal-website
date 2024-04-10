<script lang="ts" setup>
import IconLightBulb from '../../assets/icons/IconLightBulb.vue'
import IconBarChart from '../../assets/icons/IconBarChart.vue'
import IconOffice from '../../assets/icons/IconOffice.vue'
import IconHardwareChip from '../../assets/icons/IconHardwareChip.vue'
import {useThemeStore} from '../../stores/themeStore'


const props = defineProps<{
    selectedHref?: string
}>()

const themeStore = useThemeStore();

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
        
    <div class="h-screen fixed w-16 hidden md:block">
        <div class="flex h-full w-full items-center justify-center flex-col ">
            
        <div class="w-full h-full flex items-center justify-center flex-col bg-studio-1000  border border-l-0 border-accent  bg-gradient-to-t from-studio-400 to-studio-300 dark:from-purple-900 dark:to-studio-1000 opacity-80">
            <!-- Toggle Switch -->
            
            <div class=" w-12 h-8  mb-4">
                    <div @click="themeStore.toggleTheme()" class="cursor-pointer flex items-center justify-center w-full h-full  rounded-full shadow-inner-button 
                    dark:hover:bg-studio-50 dark:bg-studio-800 hover:bg-studio-800 bg-studio-50  stroke-primary hover:stroke-primary light-button">
                        <IconLightBulb class="w-[75%] h-[75%] "></IconLightBulb>
                </div>
            </div>
            <template v-for="i in navBarItems" :key="i.name">

                <div class=" w-12 h-12  mb-4">
                    <a :href="i.href" :title="i.name" class="flex items-center justify-center w-full h-full  
                      border-2 border-purple-600 hover:bg-primary dark:hover:bg-primary hover:stroke-accent hover:fill-accent dark:bg-studio-800
                      bg-studio-50  stroke-primary fill-primary  rounded-lg" :class=" selectedHref === i.href ? 'bg-purple-400 dark:bg-purple-400 dark:stroke-studio-300 dark:fill-studio-300 stroke-purple-700 fill-purple-700 shadow-glow shadow-primary' : 'shadow-glow-sm shadow-purple-600'">
                        <IconBarChart v-if="i.icon === 'overview'" class="w-[75%] h-[75%] "></IconBarChart>
                        <IconOffice v-if="i.icon === 'experience'" class="w-[75%] h-[75%] "></IconOffice>
                        <IconHardwareChip v-if="i.icon === 'skills'" class="w-[75%] h-[75%] "></IconHardwareChip>
                        
                </a>
                </div>
                
            </template>
        </div>
        </div>

	</div>
    <!-- <div class="h-screen fixed left-16 bg-primary dark:bg-accent w-0.5 hidden md:block z-10"></div> -->
</template>

<style lang="scss">
</style>