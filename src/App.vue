<script setup lang="ts">
import SideNavBar from './components/nav/SideNavBar.vue'
import { useThemeStore } from './stores/themeStore';
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import DashboardItemSkills from './components/dashboards/DashboardItemSkills.vue'
import DashBoardHoverOver from './components/dashboards/DashboardHoverOver.vue'
import {HEXAGON_VERTEX, HEXAGON_VERTEX_DARK} from './helpers/shaders/hexagons';
import { useResizeObserver } from '@vueuse/core';
import IconAvatar from './assets/icons/IconAvatar.vue'
import { useHead } from "@unhead/vue";
import IconResume from "./assets/icons/IconResume.vue";
import { event } from 'vue-gtag'

const skillsTechnology = ref(['Typescript', 'NodeJS', 'C#', 'C++', 'C', 'Kafka', 'PostgreSQL', 'REST', 'Websockets', 'Web Dev', 'Vue3', 'Game Dev', 'Unity', 'Java', 'Github Actions', 'Gitlab CI/CD', 'Kubernetes', 'Docker', 'Services', 'Linux']);
const skillsGeneral = ref(['Leadership', 'Mentor', 'Organization', 'Project Management', 'Problem Solving', 'Innovative', 'Time Management', 'CI/CD', 'DevOps', 'Scrum', 'Sprints', 'Testing']);

const themeStore = useThemeStore();
const canvas = ref<HTMLCanvasElement | null>(null);
const currentYear = new Date().getFullYear();
const yearHex = computed(() => '0x' + currentYear.toString(16).toUpperCase());

useHead({
	title: 'Alexander Xie | Personal Resume Website',
	meta: [{name: 'description', content: () => "Welcome to my professional portfolio. I'm Alexander Xie, a dedicated Full Stack Engineer with a knack for transforming ideas into scalable web applications. Here, you'll find a showcase of my technical skills, successful projects, and my approach to collaborative development. Designed with recruiters in mind, this site provides a concise overview of my capabilities and achievements. Explore to see how my expertise can contribute to your team's success. Let's connect to discuss potential opportunities."}]
})

onMounted(() => {
	if(canvas.value !== null) useResizeObserver(canvas.value, () => {
		//@ts-ignore
		canvas.value?.setSize(1,1)
	})
})

const shaderCode = ref<string>(HEXAGON_VERTEX_DARK);

watch(() => themeStore.theme, () => {
	shaderCode.value = themeStore.theme === "dark" ? HEXAGON_VERTEX_DARK : HEXAGON_VERTEX;
});

// Section tracking via Intersection Observer
const selectedHref = ref<string>("#overview");
let observer: IntersectionObserver | null = null;

onMounted(() => {
	observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				selectedHref.value = '#' + entry.target.id;
			}
		});
	}, {
		rootMargin: '-30% 0px -30% 0px',
		threshold: 0.1
	});

	['overview', 'experience', 'skills'].forEach(id => {
		const el = document.getElementById(id);
		if (el) observer?.observe(el);
	});
})

onUnmounted(() => {
	observer?.disconnect();
})
</script>

<template>

<div class="h-full relative overflow-hidden" :class="themeStore.theme === 'dark' ? 'dark' : ''" :data-theme="themeStore.theme === 'dark' ? 'dark' : ''">

	<div class="fixed bg-studio-50 dark:bg-studio-1050 w-full h-full -z-50 transition-colors duration-500"></div>
	<div class="fixed bg-studio-50 dark:bg-studio-1050 w-full h-full visible sm:hidden -z-30 transition-colors duration-500"></div>
	<div class="h-full -z-50 absolute w-full opacity-10 dark:opacity-30">
		<gl-canvas @update="() => {}" ref="canvas">
			<gl-program name="main" :code="shaderCode">
			</gl-program>
		</gl-canvas>
	</div>

	<div class="fixed rotate top-96 left-3 lg:left-6 text-primary dark:text-accent text-xs font-lekton transition-colors duration-500">
		<p>Alexander Xie @ Software Engineer</p>
	</div>
	<div class="z-10 fixed counter-rotate bottom-32 right-3 lg:right-6 text-primary dark:text-accent text-xs font-lekton transition-colors duration-500">
		<p>-- {{ yearHex }} --</p>
	</div>

	<SideNavBar :selectedHref="selectedHref" />

	<div class="main h-full min-h-screen pb-16 md:pb-0">
		<div class="text-center font-bold dark:font-normal text-purple-900 dark:text-sand-100 font-lekton transition-colors duration-500">

			<div id="overview" class="flex flex-wrap lg:flex-nowrap lg:min-h-screen items-center">
				<div class="lg:w-[30vh]"></div>

				<!-- Profile Card -->
				<div class="flex-auto items-center inline-block w-full m-6 lg:m-10 lg:max-w-96 min-h-80 lg:mx-28 p-6 bg-studio-300 dark:bg-purple-900 border border-primary shadow-glow-lg rounded-lg shadow-accent bg-gradient-to-tr from-purple-200 to-purple-100 dark:from-purple-900 dark:to-purple-800 transition-all duration-500">

					<div class="p-3 lg:p-4"></div>
					<div class="flex items-center justify-center w-full">
						<div class="aspect-square h-32 bg-purple-100 dark:bg-purple-300 rounded-full flex items-center justify-center shadow-glow-lg shadow-purple-600 border-4 border-primary transition-shadow duration-500">
							<IconAvatar class="p-4 w-full h-full"></IconAvatar>
						</div>
					</div>
					<div class="p-3 lg:p-4"></div>

					<h1 class="font-lekton text-3xl font-bold text-left mx-4 mb-1">Alexander Xie</h1>
					<p class="text-lg font-medium text-left mx-4 text-primary dark:text-purple-300 tracking-wide">Software Engineer</p>
					<div class="h-px w-16 bg-primary/40 mx-4 my-3"></div>
					<p class="text-wrap mx-4 text-left leading-relaxed text-sm opacity-90">&Tab;Driven by a passion for technology and collaboration, I craft scalable solutions that empower projects and bring complex ideas to life.</p>

					<h2 class="mx-4 mt-5 mb-2 text-left text-sm uppercase tracking-widest text-primary/80 dark:text-purple-300/80">Key Values</h2>
					<div class="w-full h-fit flex flex-col items-center">
						<div class="flex w-fit h-fit flex-col items-start text-sm gap-0.5">
							<p class="hover:text-primary transition-colors duration-200">> Innovation driven</p>
							<p class="hover:text-primary transition-colors duration-200">> Embracing new challenges</p>
							<p class="hover:text-primary transition-colors duration-200">> Constantly Learning</p>
							<p class="hover:text-primary transition-colors duration-200">> Leadership and DevOps</p>
							<p class="hover:text-primary transition-colors duration-200">> Broad grasp on technology</p>
						</div>
					</div>

					<div class="p-4"></div>
					<div class="w-full align-bottom flex-1 flex-wrap justify-center pb-4">
						<div class="self-end text-lg pb-4 flex items-center justify-center">
							<a target="_blank" href="/assets/resume/Alexander Xie Resume.pdf" @click="event('opened_resume', {})" class="flex items-center justify-center cursor-pointer hover:text-bright-500 hover:fill-bright-500 dark:hover:stroke-bright-500 fill-primary pr-2 hover:border-bright-500 border border-primary bg-gradient-to-bl from-studio-50 to-studio-200 dark:from-studio-800 dark:to-studio-950 hover:from-studio-1000 hover:to-studio-1050 dark:hover:from-studio-1000 dark:hover:to-studio-1050 select-none shadow-glow hover:shadow-glow-lg shadow-primary hover:shadow-bright-500 transition-all duration-300 rounded-sm">
								<IconResume class="w-8 m-2" />
								<p class="pr-2 text-xl">
									My Resume
								</p>
							</a>
						</div>
					</div>
				</div>

				<!-- Dashboard Panel -->
				<div class="p-6 lg:p-10 flex-auto mx-[3vh] lg:my-10 w-[100vh] border border-primary rounded-lg bg-studio-300 dark:bg-purple-900 bg-gradient-to-tr from-studio-100 to-studio-300 dark:from-studio-1050 dark:to-studio-1000 shadow-accent shadow-glow transition-all duration-500">
					<div class="flex flex-wrap justify-center items-center gap-2">

						<div id="skills" class="flex flex-wrap justify-center items-center gap-2">
							<div class="flex-none flex w-[60vw] h-[300px] md2:w-[250px] lg1.5:w-[300px] bg-studio-100 dark:bg-studio-1000 rounded-lg shadow-glow shadow-accent m-1 overflow-hidden transition-colors duration-500">
								<DashboardItemSkills title="Technologies" :list="skillsTechnology"/>
							</div>
							<div class="flex-none w-[60vw] h-[300px] md2:w-[250px] lg1.5:w-[300px] bg-studio-100 dark:bg-studio-1000 rounded-lg shadow-glow shadow-accent m-1 overflow-hidden transition-colors duration-500">
								<DashboardItemSkills title="Skills" :list="skillsGeneral"/>
							</div>
						</div>
						<div id="experience" class="flex-none w-[60vw] lg:w-[40vw] lg2:w-[40vw] xlg:w-[40vw] h-fit md:h-[300px] m-1 overflow-hidden">
							<DashBoardHoverOver/>
						</div>
					</div>
				</div>

				<div class="lg:w-[20vh]"></div>
			</div>

			<footer class="py-6 text-center">
				<div class="flex flex-col items-center gap-1">
					<div class="h-px w-24 bg-primary/20 mb-3"></div>
					<p class="text-xs text-studio-600 dark:text-studio-400 font-lekton">
						&copy; {{ currentYear }} Alexander Xie
					</p>
				</div>
			</footer>

		</div>
	</div>

</div>
</template>


<style lang="scss">

.rotate {
    transform: translateX(-50%) translateY(-50%) rotate(-90deg);
	user-select: none;
}

.counter-rotate
{
	-webkit-transform-origin: 50% 50%;
    transform: translateX(50%) translateY(-50%) rotate(90deg);
	user-select: none;
}

/* Scrollbar - defaults to dark theme */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
	background: #190f27;
}

::-webkit-scrollbar-thumb {
	background: #663399;
	border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
	background: #BB77FF;
}

/* Light theme scrollbar */
body[data-theme="light"] ::-webkit-scrollbar-track {
	background: #e4ddf7;
}

body[data-theme="light"] ::-webkit-scrollbar-thumb {
	background: #9c79d9;
	border-radius: 5px;
}

body[data-theme="light"] ::-webkit-scrollbar-thumb:hover {
	background: #8c5bcc;
}

body {
	background: #180f26;
	transition: background-color 0.5s ease;
}
</style>
