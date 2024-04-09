<script setup lang="ts">
import DividerBar from "./components/DividerBar.vue";

import NavBar from './components/nav/NavBar.vue'
import SideNavBar from './components/nav/SideNavBar.vue'
import { useThemeStore } from './stores/themeStore';
import { onMounted, ref, watch } from 'vue';
import DashboardItemSkills from './components/dashboards/DashboardItemSkills.vue'
import DashBoardHoverOver from './components/dashboards/DashboardHoverOver.vue'
import {HEXAGON_VERTEX, HEXAGON_VERTEX_DARK} from './helpers/shaders/hexagons';
import { useResizeObserver } from '@vueuse/core';
import IconAvatar from './assets/icons/IconAvatar.vue'
import IconCodeDownload from './assets/icons/IconCodeDownload.vue'


const skillsTechnology = ref(['Typescript', 'NodeJS', 'C#', 'C++', 'C', 'Kafka', 'PostgreSQL', 'REST', 'Websockets', 'Web Dev', 'Game Dev']);
const skillsGeneral = ref(['Leadership', 'Mentor', 'Organization', 'Project Management', 'Problem Solving', 'Innovative', 'Time Management']);

function getX()
{
	return Math.floor(Math.random() * 10000000000).toString(16)
}

const themeStore = useThemeStore();

const scrollbarBackground = ref("green");
const scrollbarBackgroundTEst = ref("0px");
const canvas = ref<HTMLCanvasElement | null>(null);
const background = ref<HTMLElement | null>(null);

onMounted(() =>{
	console.log(canvas);
	if(canvas.value !== null) useResizeObserver(canvas.value, () => {
		//@ts-ignore
		console.log(canvas.value?.setSize(1,1)) // Some how sets the actual size
	})
	
})
const shaderCode = ref<string>(HEXAGON_VERTEX_DARK);
function glslUpdate()
{

}

watch(() => themeStore.theme, () => {
	scrollbarBackground.value = themeStore.theme === "dark" ? "#0f0f0f" : "#e4ddf7";
	shaderCode.value = themeStore.theme === "dark" ? HEXAGON_VERTEX_DARK : HEXAGON_VERTEX;
});

</script>

<template>

<div class="h-full relative overflow-hidden " :class="themeStore.theme === 'dark' ? 'dark' : '' "  :data-theme=" themeStore.theme === 'dark' ? 'dark' : ''"> 

	<div class="fixed bg-studio-50 dark:bg-studio-1050 w-full h-full -z-50	"></div> 
	<div class="fixed bg-studio-50 dark:bg-studio-1050 w-full h-full visible sm:hidden -z-30"></div> 
	<div class="h-full -z-50 absolute w-full opacity-10 dark:opacity-30 " ref="background">
		<gl-canvas @update="glslUpdate" class="" ref="canvas">
			<gl-program name="main" :code="shaderCode" >
			</gl-program>
		</gl-canvas>
	</div>
<!-- <div class="fixed rotate top-96 left-3 lg:left-6 text-sand-100 text-xs font-lekton ">
		<p>Alexander Xie @ Software Engineer </p>
	</div> -->
	<div class="fixed rotate top-96 left-3 lg:left-20 text-primary  dark:text-accent text-xs font-lekton ">
		<p>Alexander Xie @ Software Engineer </p>
	</div>
	<div class="z-10 fixed counter-rotate bottom-32 right-3 lg:right-6 text-primary  dark:text-accent text-xs font-lekton">
		<p>-- {{ getX() }} --</p> <!-- TODO: Add actual data here -->
	</div>

	<SideNavBar class="hidden"/>
	
	<div class="main h-full min-h-screen bg-gradient-to-br md:pl-16" >
		<div class="text-center font-bold dark:font-normal text-purple-900 dark:text-sand-100 font-lekton  ">
			<NavBar class="md:hidden"></NavBar> <!-- For top bar fdding-->
			<NavBar class="md:hidden" :sticky="true"></NavBar> 
			<div id="overview" class="flex flex-wrap lg:flex-nowrap lg:min-h-[70vh]">
				<div class="lg:w-[30vh]"></div>
				<div class="flex-auto items-center inline-block w-full m-10 lg:max-w-96 min-h-80 lg:mx-28  p-4 bg-studio-300 dark:bg-purple-900 card border border-primary shadow-glow-lg rounded-b-lg shadow-accent bg-gradient-to-tr from-purple-200 to-purple-100 dark:from-purple-900 dark:to-purple-800" >
					
					<div class="p-4 lg:p-4"></div>
					<div class="flex items-center justify-center w-full">
						<div class="aspect-square h-32 bg-purple-100 dark:bg-purple-300 rounded-full flex items-center justify-center shadow-glow-lg shadow-purple-600 border-4 border-primary ">
							<IconAvatar class="p-4 w-full h-full"></IconAvatar>
						</div>
					</div>
					<div class="p-4 lg:p-4"></div>
					<h1 class="font-lekton text-3xl font-bold text-left m-4 mb-0">Alexander Xie</h1>
					<h1 class="text-xl font-medium text-left m-4 mt-0">Software Enginer</h1>
					<p class="text-wrap m-4 text-left indent-">&Tab;Driven by a passion for technology and collaboration, I craft scalable solutions that empower projects and bring complex ideas to life.</p>
					<h1 class="text-wrap m-4 text-left">Key values</h1>
					<div class="w-full h-fit flex flex-col items-center">
						<div class="flex w-fit h-fit flex-col items-start">
							<p>> Innovation driven</p>
							<p>> Embracing new challenges</p>
							<p>> Constantly Learning</p>
							<p>> Leadership and DevOps</p>
							<p>> Broad grasp on technology</p>
						</div>
					</div>

					<div class="p-6"></div>
					<div class="w-full align-bottom flex-1 flex-wrap justify-center"> 
						<a class="self-end text-lg pb-4 flex items-center justify-center">
							<a class="flex  items-center justify-center cursor-pointer hover:text-bright-500 hover:stroke-bright-500 dark:hover:stroke-bright-500 stroke-accent dark:stroke-primary  pr-2 hover:border hover:border-bright-500 border border-primary bg-gradient-to-bl from-studio-800 to-studio-950 hover:from-studio-1000 hover:to-studio-1050 select-none shadow-glow hover:shadow-glow-lg shadow-primary hover:shadow-bright-500 ">
								<IconCodeDownload class="w-8 h-8 m-2 mt-1 " />
								<p>
									Resume Download 
								</p>
							</a>
						</a>	
					</div>
				</div>
				<div class="p-10 flex-auto mx-[3vh] lg:my-10  w-[100vh] border border-primary rounded-b-lg  bg-studio-300 dark:bg-purple-900 bg-gradient-to-tr from-studio-100 to-studio-300 dark:from-studio-1050 dark:to-studio-1000 shadow-accent shadow-glow">
					<div class="flex flex-wrap justify-center items-center">
						
						<div class="flex-none flex w-[60vw] h-[300px] md2:w-[250px] lg1.5:w-[300px] bg-studio-100 dark:bg-studio-1000  rounded-lg shadow-glow shadow-accent m-2 overflow-hidden">
							<DashboardItemSkills title="Technologies" :list="skillsTechnology"/>
						</div>
						<div class="flex-none w-[60vw] h-[300px] md2:w-[250px] lg1.5:w-[300px] bg-studio-100 dark:bg-studio-1000 rounded-lg shadow-glow shadow-accent m-2 overflow-hidden">
							<DashboardItemSkills title="Skills"  :list="skillsGeneral"/>
						</div>
						<div class="flex-none w-[60vw] lg:w-[40vw] lg2:w-[40vw] xlg:w-[40vw] h-fit md:h-[300px]  m-2 overflow-hidden">
							<DashBoardHoverOver/>
						</div>
						<!-- <div class="flex-none w-[300px] h-[200px] bg-background-card rounded-lg shadow-sm shadow-accent m-2"></div> -->
						<!-- <div class="flex-none w-[200px] h-[200px] bg-background-card rounded-lg shadow-sm shadow-accent m-2"></div> -->
						<!-- <div class="flex-none w-[200px] h-[200px] bg-background-card rounded-lg shadow-sm shadow-accent m-2"></div> -->
					</div>
				</div>
				<div class="lg:w-[20vh]"></div>
			</div>

			<div class="py-[5vh]"></div>
			
			<DividerBar/>

			<div class="flex justify-center items-center py-[10vh] left-16 right-0 ">
				<div class="relative w-[80%] lg:ml-16 min-h-[90vh] border border-primary bg-studio-200 shadow-glow shadow-accent m-2 dark:bg-purple-900 rounded-xl">
					<div id="experience" class="absolute -top-10"></div>
					<h1>
						Experience
					</h1>
					<h1>
						LightRiver Software
					</h1>
					<h2>
						Lead Full stack and DevOps Engineer
					</h2>
					<p> 
						During this role I ....
					</p>
				</div>
			</div>
			<DividerBar/>

			<div  class="flex justify-center items-center py-[10vh] left-16 right-0 ">
				<div class="relative w-[80%] lg:ml-16 min-h-[90vh] border border-primary bg-studio-200 shadow-glow shadow-accent m-2 dark:bg-purple-900 rounded-xl">
					<div id="skills" class="absolute -top-10"></div>
					<h1>
						Skills
					</h1>

					<h2>
						Technology
					</h2>

					<p v-for="i,j in skillsTechnology" :key="j">
						{{ i }}
					</p>

					<h2>
						General Skills
					</h2>

					<p v-for="i,j in skillsGeneral" :key="j">
						{{ i }}
					</p>

				</div>
			</div>



			<div class="w-full p-10 bg-studio-300 dark:bg-studio-1000 opacity-70">
				<div>Github | Contact Info | Instagram ?</div>
				© 2024 Alexander Xie
			</div>
			
			<!-- <div><p>a123123sdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p><p>asdasd</p></div> -->
			<!-- <div class="p-2"></div>


			<div class="mx-4">
				
			<div class="grid grid-flow-row grid-cols-4 gap-4">
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
				<div class="bg-studio-800 border-studio-700 border-2 rounded m-2 py-4">
					<div class="m-4 p-4 bg-studio-700 border-studio-900 border-2">
						<h1>
							Some very important text
						</h1>
					</div>
					<p class="p-4">
						Some other detail text
					</p>
				</div>
			</div>
			</div> -->
		</div>

		
	</div>
	
</div>
</template>


<style lang="scss">


.rotate {  
    transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
	user-select:none;
}

.counter-rotate
{
	-webkit-transform-origin: 50%  50%;
    transform:  translateX(50%) translateY(-50%) rotate(90deg);
	user-select:none;
}

// .card {
// 	box-shadow: 10px 10px #111111;
// }


/* width */
::-webkit-scrollbar{
    width: 12px;
}
  
  /* Track */
::-webkit-scrollbar-track {
	background: #362055;
}

/* Handle */
::-webkit-scrollbar-thumb {
	background: #8844CC;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
	background: #BB77FF;
}
</style>./helpers/shaders/hexagons