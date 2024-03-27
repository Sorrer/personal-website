<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import NavBar from './components/nav/NavBar.vue'

function getX()
{
	return Math.floor(Math.random() * 10000000000).toString(16)
}

</script>

<template>

	<div class="fixed rotate top-96 left-3 lg:left-6 text-sand-100 text-xs font-lekton ">
		<p>Alexander Xie @ Software Engineer </p>
	</div>
	<div class="fixed counter-rotate bottom-32 right-3 lg:right-6 text-sand-100 text-xs font-lekton">
		<p>-- {{ getX() }} --</p> <!-- TODO: Add actual data here -->
	</div>

	<div class="main h-full min-h-screen bg-gradient-to-br from-background-from to-background-to ">
		<div class="text-center text-sand-100 font-lekton  ">
			<NavBar></NavBar>
			<NavBar :sticky="true"></NavBar> <!-- For top bar padding-->
			<div class="p-4"></div>
			<div class="flex flex-wrap lg:flex-nowrap lg:min-h-[70vh] ">
				<div class="lg:w-[20vh]"></div>
				<div class="flex-auto items-center inline-block w-full m-10 lg:max-w-96 min-h-80 lg:mx-28 lg:my-32 p-4  bg-background-card card border-t-4 border-accent shadow-md rounded-b-lg shadow-accent" >
					
					<div class="p-4 lg:p-4"></div>
					<h1 class="font-lekton">Alexander Xie</h1>
					<h1>Software Enginer</h1>
					<p class="text-wrap m-4 text-left indent-4">&Tab;Some long paragraph that talks about myself. Something like "Hi I am this persons"</p>
					<h1 class="text-wrap m-4 text-left">Key values</h1>
					<p>> Something of value</p>
					<p>> Something of value</p>
					<p>> Something of value</p>
					<p>> Something of value</p>
					<p>> Something of value</p>
					<div class="p-6"></div>
				</div>
				<div class="flex-auto m-10 lg:my-40 lg:h-full lg:mx-40 bg-background-navbuttonselected overflow-hidden">
					<div class="flex justify-center items-center h-[50vh]">
						<img class="flex-auto object-cover" src="">
					</div>
				</div>
				<div class="lg:w-[20vh]"></div>
			</div>

			<div class="py-[5vh]"></div>
			<div class="w-full flex">
				<div style="height: 2px" class="mx-[10vh]  lg:mx-[30vh] w-full bg-studio-600"></div>
			</div>
			<div class="py-2 w-full flex">
				<div style="height: 2px" class="mx-[10vh] lg:mx-[30vh] w-full bg-studio-900"></div>
			</div>


			<div class="flex justify-center items-center py-[10vh]">
				<div class="w-[40vh] h-[40vh] lg:h-[80vh] lg:w-[80vh] bg-studio-950 rounded-full">
					Some fun stuff
				</div>
			</div>

			<div class="w-full flex">
				<div style="height: 2px" class="mx-[10vh]  lg:mx-[30vh] w-full bg-studio-600"></div>
			</div>
			<div class="py-2 w-full flex">
				<div style="height: 2px" class="mx-[10vh] lg:mx-[30vh] w-full bg-studio-900"></div>
			</div>

			<div class="flex justify-center items-center py-[10vh]">
				<div class="w-[40vh] h-[40vh] lg:h-[80vh] lg:w-[80vh] bg-studio-950 rounded-full">
					Experiences
				</div>
			</div>
			
			<div class="w-full flex">
				<div style="height: 2px" class="mx-[10vh]  lg:mx-[30vh] w-full bg-studio-600"></div>
			</div>
			<div class="py-2 w-full flex">
				<div style="height: 2px" class="mx-[10vh] lg:mx-[30vh] w-full bg-studio-900"></div>
			</div>

			<div class="flex justify-center items-center py-[10vh]">
				<div class="w-[40vh] h-[40vh] lg:h-[80vh] lg:w-[80vh] bg-studio-950 rounded-full">
					Portfolio
				</div>
			</div>

			<div class="w-full p-10 bg-background-footer">
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
</template>


<style>
.rotate {  
    transform:  translateX(-50%) translateY(-50%) rotate(-90deg);
}

.counter-rotate
{
	-webkit-transform-origin: 50%  50%;
    transform:  translateX(50%) translateY(-50%) rotate(90deg);
}

.card {
	box-shadow: 10px 10px #111111;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #060606;
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