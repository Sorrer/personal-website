<script lang="ts" setup>
    import NavBarItem from './NavBarItem.vue';

    const props = defineProps({
        sticky: Boolean
    })
</script>

<template>

    <div clas="bg-gray-800  ">
        <!-- <div class="px-6 flex flex-wrap items-center justify-between mx-auto py-3">
            <a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
            </a>

            <div class="hidden w-full md:block md:w-auto">
                <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <NavBarButton text="About"></NavBarButton>
                    <NavBarButton text="Skills"></NavBarButton>
                    <NavBarButton text="Portfolio"></NavBarButton>
                    <NavBarButton text="Hobbies"></NavBarButton>
                </ul>
            </div>
        </div> -->

        <div :class="sticky ? 'fixed' : ''" class="top-0 w-full h-fit items-centers text-center bg-background-nav overflow-hidden shadow-md shadow-background-navbutton">
             <ul class="inline-block items-center h-fit">
                <NavBarItem :selected="true" nav-text="summary"/>
                <NavBarItem nav-text="skills"/>
                <NavBarItem nav-text="experience"/>
                <NavBarItem nav-text="portfolio"/>  
                <!-- <div class="fixed w-36 h-12 inline m-16 bg-accent"></div> -->
            </ul>
            <div class="absolute w-full h-1 border-0 border-t border-primary -z-10 bottom-[1px]"></div>
           
            <div class="w-full h-1 bg-background-navbutton" ></div>
        </div>
    </div>

</template>

<style scoped>

.nav{
    text-align: center;
}

.nav ul
{
    display: inline-block;
}

</style>