<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import NavBar from './components/nav/NavBar.vue'


</script>

<template>
	<div class="h-full min-h-screen bg-gradient-to-br from-background-from to-background-to ">
		<div class="text-center text-sand-100 font-lekton ">
			<div class="flex justify-center items-center py-[10vh]">
				<div class="flex justify-center items-center w-[50vh] h-[50vh] lg:h-[90vh] lg:w-[90vh] shadow-glow shadow-background-to bg-gradient-to-b from-background-navbuttonselected to-background-to2 rounded-full">
					<div class="w-[40vh] h-[40vh] lg:h-[88vh] lg:w-[88vh] shadow-lg shadow-studio-950 bg-gradient-to-b from-studio-950 to-studio-900 rounded-full">
						Portfolio
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<style>
</style>