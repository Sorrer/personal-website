<script setup lang="ts">
import { computed, onMounted, ref, nextTick} from 'vue';
import {useResizeObserver} from '@vueuse/core'


const props = defineProps({
    title: String,
    list: {
        type: Array<string>,
        required: true
    }
})

interface CircleData 
{
    position: { x: number, y: number},
    hidden?: boolean,
    previousDistance?: number,
    selected?: boolean,
    name: string
}

// TODO: Bug with unhiding elements after their "long journey"

const items = ref<CircleData[]>([             

]) 


function shuffle<T>(array : T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


const selectedIndex = ref(Math.floor(Math.random() * items.value.length));
const anchor = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
useResizeObserver (container, () => {
    calculatePositions();

})

window.addEventListener('resize', () => {calculatePositions()})


onMounted(()=> {

    // Shuffle list to make page unique
    const newItems = shuffle([... props.list]);

    // Add twice to fill in the space
    for(let item of newItems)
    {
        items.value.push({name: item, position: {x:0,y:0}})
    }
    for(let item of newItems)
    {
        items.value.push({name: item, position: {x:0,y:0}})
    }

    nextItem();

    setInterval(() => {
        nextItem();
    }, 4000)

    for(let i = 0; i < items.value.length; i++)
    {
        items.value[i].hidden = true;
        setTimeout(() => {items.value[i].hidden = false;}, 1)
    }
    setTimeout(() => {nextItem()}, 10)


    // Prevent the browser and css transitions happening on an invalid step (which can get desync'd towards when window is not active)
    document.addEventListener("visibilitychange", () => {
        for(let i = 0; i < items.value.length; i++)
        {
            items.value[i].hidden = true;
            setTimeout(() => {items.value[i].hidden = false;}, 5)
        }
    })

    
})

function nextItem()
{
    selectedIndex.value += 1;

    if(selectedIndex.value >= items.value.length)
    {
        selectedIndex.value = 0;
    }

    calculatePositions();
}



function calculatePositions()
{
    const target = selectedIndex.value;
    let width = 50;
    let margin = 50;
    let offset = 0;
    let yPos = 0;

    if(anchor.value)
    {
        yPos = anchor.value.offsetTop;
        offset = anchor.value.offsetLeft;
        width = anchor.value.clientWidth;
        margin = 10;
    }

    let distances = "";
    let posX = "";
    for(let i = 0; i < items.value.length; i++)
    {
        items.value[i].hidden = false;
        let distance = i - target;

        if(Math.abs(distance) > Math.abs(i - (target + items.value.length)))
        {
            distance = i - (target + items.value.length)
        }

        if(Math.abs(distance) > Math.abs((i + items.value.length) - target))
        {
            distance = (i + items.value.length) - target
        }

        const newX = ((width + margin) * distance) + offset;

        if(Math.abs(newX - items.value[i].position.x) > width + margin)
        {

            items.value[i].hidden = true;
        }

        distances += distance + ', ';
        posX += newX + ', ';
        items.value[i].previousDistance = distance;
        items.value[i].position.x = newX;
        items.value[i].position.y = yPos;

        items.value[i].selected = target === i
    }

}


</script>

<template>
    <div class="w-full h-full relative flex overflow-hidden select-none" ref="container">
        <a href="#skills" class="absolute w-full h-full overflow-hidden inline-table hover:bg-studio-600 dark:hover:bg-purple-800 cursor-pointer">
            <div class="flex items-center justify-center"> 
                <p class=" text-primary p-8">
                    {{ title }}
                </p>
            </div>
            <!-- <div class="absolute bottom-0 h-[12pxx] w-full bg-[rgba(255,255,255,0.04)] rounded-b-lg hover:bg-primary hover:cursor-pointer select-none">
                [ more ]
            </div> -->
            <template v-for="i,j of items" :key="j">
                <div 
                    class="circle absolute w-[140px] h-[140px]" 
                    :class="i.hidden ? 'hidden' : '' +
                            (j === selectedIndex ? 'bg-studio-50 dark:bg-studio-900 shadow-glow shadow-primary' : ' scaledDown  bg-studio-300 dark:bg-studio-900')
                            " 
                    :style="{left: items[j].position.x + 'px', top: items[j].position.y +'px'}">
                    <div class="flex w-full h-full items-center justify-center text-xl">
                        {{  i.name }}
                    </div>
                </div>
            </template>
        </a>
        <div class="flex grow items-center justify-center">
            <div class="w-[140px] h-[140px] bg-none" ref="anchor">
            </div>
        </div>
    </div>
</template>


<style>
.scaledDown
{
    transform: scale(0.5);
    opacity: 0.5;
}
.circle{
    border-radius: 100%;
    transition: all  1s ease;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}
</style>