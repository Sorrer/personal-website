<script lang="ts" setup>
import IconLightBulb from '../../assets/icons/IconLightBulb.vue'
import {useThemeStore} from '../../stores/themeStore'

const themeStore = useThemeStore();



</script>

<template>
        
    <div class="h-screen fixed w-16 bg-studio-200 dark:bg-studio-1000 hidden md:block">
		
        <div class="w-full h-full flex items-center justify-center flex-col">
            <template v-for="i in [1,2,3,4,5,6,7,8]" :key="i">

                <div class=" w-12 h-12  mb-4">
                    <div @click="themeStore.toggleTheme()" class="flex items-center justify-center w-full h-full  shadow-inner-button dark:hover:bg-studio-50 dark:bg-studio-800 hover:bg-studio-800 bg-studio-50  stroke-primary hover:stroke-primary light-button">
                        <IconLightBulb class="w-[75%] h-[75%] "></IconLightBulb>
                    </div>
                </div>
                
            </template>
        </div>

	</div>
    <div class="h-screen fixed left-16 bg-primary dark:bg-accent w-0.5 hidden md:block"></div>
</template>

<style lang="scss">
.light-button
{
    cursor: pointer;
    stroke: white;
    transition: all 0.1s ease-in-out;

    &:hover {
        stroke: black;
    }
}

.dark-button
{
    cursor: pointer;
    stroke: black;
    transition: all 0.1s ease-in-out;

    &:hover {
        stroke: white;
    }
}

</style>