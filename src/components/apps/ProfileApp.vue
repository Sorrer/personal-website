<script setup lang="ts">
import IconAvatar from '../../assets/icons/IconAvatar.vue'
import IconResume from '../../assets/icons/IconResume.vue'
import { event } from 'vue-gtag'

const keyValues = [
  'Innovation driven',
  'Embracing new challenges',
  'Constantly Learning',
  'Leadership and DevOps',
  'Broad grasp on technology',
]
</script>

<template>
  <div class="p-5 h-full overflow-auto font-lekton text-purple-900 dark:text-sand-100 transition-colors duration-500">

    <!-- Avatar -->
    <div class="flex items-center justify-center w-full mb-4">
      <div class="aspect-square h-28 bg-purple-100 dark:bg-purple-300 rounded-full flex items-center justify-center shadow-glow shadow-purple-600 border-2 border-primary transition-all duration-500">
        <IconAvatar class="p-3 w-full h-full" />
      </div>
    </div>

    <!-- Name / Title -->
    <div class="mb-4">
      <p class="text-bright-700 dark:text-bright-500 text-[10px] tracking-widest mb-1 opacity-70">// IDENTITY</p>
      <h1 class="text-2xl font-bold text-primary">Alexander Xie</h1>
      <p class="text-sm text-primary/70 dark:text-purple-300 tracking-wide">&gt; Software Engineer</p>
    </div>

    <div class="h-px w-full bg-primary/20 my-3"></div>

    <!-- Bio -->
    <div class="mb-4">
      <p class="text-bright-700 dark:text-bright-500 text-[10px] tracking-widest mb-1 opacity-70">// BIO</p>
      <p class="text-sm leading-relaxed opacity-90">Driven by a passion for technology and collaboration, I craft scalable solutions that empower projects and bring complex ideas to life.</p>
    </div>

    <div class="h-px w-full bg-primary/20 my-3"></div>

    <!-- Key Values -->
    <div class="mb-4">
      <p class="text-bright-700 dark:text-bright-500 text-[10px] tracking-widest mb-2 opacity-70">// KEY_VALUES[]</p>
      <div class="flex flex-col gap-1 text-sm">
        <p v-for="(val, i) in keyValues" :key="i">
          <span class="text-studio-500 text-[10px] mr-1">[{{ i }}]</span> {{ val }}
        </p>
      </div>
    </div>

    <div class="h-px w-full bg-primary/20 my-3"></div>

    <!-- Resume Link -->
    <div class="flex justify-center pt-2 pb-1">
      <a
        target="_blank"
        href="/assets/resume/Alexander Xie Resume.pdf"
        @click="event('opened_resume', {})"
        class="flex items-center justify-center cursor-pointer hover:text-bright-700 dark:hover:text-bright-500 hover:fill-bright-700 dark:hover:fill-bright-500 dark:hover:stroke-bright-500 fill-primary pr-2 hover:border-bright-700 dark:hover:border-bright-500 border border-primary bg-gradient-to-bl from-studio-50 to-studio-200 dark:from-studio-800 dark:to-studio-950 hover:from-studio-200 hover:to-studio-300 dark:hover:from-studio-1000 dark:hover:to-studio-1050 select-none shadow-glow hover:shadow-glow-lg shadow-primary hover:shadow-bright-700 dark:hover:shadow-bright-500 transition-all duration-300 rounded-sm text-purple-900 dark:text-sand-100"
      >
        <IconResume class="w-7 m-2" />
        <p class="pr-2 text-base">Download Resume</p>
      </a>
    </div>
  </div>
</template>
