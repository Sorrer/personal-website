<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import DividerBar from "./components/DividerBar.vue";

import NavBar from './components/nav/NavBar.vue'
import SideNavBar from './components/nav/SideNavBar.vue'
import { useThemeStore } from './stores/themeStore';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import DashboardItemSkills from './components/dashboards/DashboardItemSkills.vue'
import DashBoardHoverOver from './components/dashboards/DashboardHoverOver.vue'

function getX()
{
	return Math.floor(Math.random() * 10000000000).toString(16)
}

const themeStore = useThemeStore();

const scrollbarBackground = ref("green");
const scrollbarBackgroundTEst = ref("0px");


watch(() => themeStore.theme, () => {
	scrollbarBackground.value = themeStore.theme === "dark" ? "#0f0f0f" : "#e4ddf7";
});

</script>

<template>

<div class="h-full " :class="themeStore.theme === 'dark' ? 'dark' : '' "  :data-theme=" themeStore.theme === 'dark' ? 'dark' : ''"> 
	<div class="fixed bg-studio-50 dark:bg-studio-1050 w-full h-full -z-50	"></div>
<!-- <div class="fixed rotate top-96 left-3 lg:left-6 text-sand-100 text-xs font-lekton ">
		<p>Alexander Xie @ Software Engineer </p>
	</div> -->
	<div class="fixed rotate top-96 left-3 lg:left-20 text-primary  dark:text-accent text-xs font-lekton ">
		<p>Alexander Xie @ Software Engineer </p>
	</div>
	<div class="fixed counter-rotate bottom-32 right-3 lg:right-6 text-primary  dark:text-accent text-xs font-lekton">
		<p>-- {{ getX() }} --</p> <!-- TODO: Add actual data here -->
	</div>

	<SideNavBar class="hidden"/>
	
	<div class="main h-full min-h-screen bg-gradient-to-br bg-studio-50 dark:bg-studio-1050" >
		<div class="text-center font-bold dark:font-normal text-purple-900 dark:text-sand-100 font-lekton  ">
			<NavBar class="lg:hidden"></NavBar> <!-- For top bar fdding-->
			<NavBar class="lg:hidden" :sticky="true"></NavBar> 
			<div class="flex flex-wrap lg:flex-nowrap lg:min-h-[70vh]">
				<div class="lg:w-[30vh]"></div>
				<div class="flex-auto items-center inline-block w-full m-10 lg:max-w-96 min-h-80 lg:mx-28  p-4 bg-studio-300 dark:bg-purple-900 card border border-primary shadow-glow-lg rounded-b-lg shadow-accent bg-gradient-to-tr from-purple-200 to-purple-100 dark:from-purple-900 dark:to-purple-800" >
					
					<div class="p-4 lg:p-4"></div>
					<h1 class="font-lekton text-3xl font-bold text-left m-4 mb-0">Alexander Xie</h1>
					<h1 class="text-xl font-medium text-left m-4 mt-0">Software Enginer</h1>
					<p class="text-wrap m-4 text-left indent-">&Tab;Driven by a passion for technology and collaboration, I craft scalable solutions that empower projects and bring complex ideas to life.</p>
					<h1 class="text-wrap m-4 text-left">Key values</h1>
					<p>> Innovation driven</p>
					<p>> Embracing new challenges</p>
					<p>> Constantly Learning</p>
					<p>> Leadership and DevOps</p>
					<p>> Broad grasp on technology</p>
					<div class="p-6"></div>
				</div>
				<div class="p-10 flex-auto mx-[3vh] lg:my-10  w-[100vh] border border-primary rounded-b-lg  bg-studio-300 dark:bg-purple-900 bg-gradient-to-tr from-studio-100 to-studio-300 dark:from-studio-1050 dark:to-studio-1000 shadow-accent shadow-glow">
					<div class="flex flex-wrap justify-center items-center">
						<div class="flex-none w-[60vw] lg:w-[40vw] lg2:w-[40vw] xlg:w-[40vw] h-fit md:h-[300px]  m-2 overflow-hidden">
							<DashBoardHoverOver/>
						</div>
						<div class="flex-none flex w-[60vw] h-[300px] lg:w-[300px] bg-studio-100 dark:bg-studio-1000  rounded-lg shadow-glow shadow-accent m-2 overflow-hidden">
							<DashboardItemSkills title="Technologies" :list="['Typescript', 'NodeJS', 'C#', 'C++', 'C', 'Kafka', 'PostgreSQL', 'REST', 'Websockets', 'Web Dev']"/>
						</div>
						<div class="flex-none w-[60vw] h-[300px] lg:w-[300px] bg-studio-100 dark:bg-studio-1000 rounded-lg shadow-glow shadow-accent m-2 overflow-hidden">
							<DashboardItemSkills title="Skills"  :list="['Leadership', 'Mentor', 'Organization', 'Project Management', 'Problem Solving', 'Innovative', 'Time Management']"/>
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
				<div class="w-[80%] lg:ml-16 min-h-[90vh] border border-primary bg-studio-200 shadow-glow shadow-accent m-2 dark:bg-purple-900 rounded-xl">
					Experience

					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
					<p> Paragraphs of text</p>
				</div>
			</div>


			<div class="w-full p-10 bg-studio-300 dark:bg-studio-1000">
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
</style>