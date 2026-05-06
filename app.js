const app = Vue.createApp({
    data(){
        return{
            peliculas:[],
            cargando: true,
            busqueda: '',
            plataformaSeleccionada: 'Todas',
            plataformas: ['Todas', 'Netflix', 'Disney+', 'Prime Video', 'Cines'],
        }
    },
    async mounted() {
        try {
            this.cargarFavoritos()
            const response = await fetch('./data.json')
            const data = await response.json()
            this.peliculas = data.map(item => ({
            ...item,
            mostrarDesc: false,
            favorito: false
            }))
            this.cargando = false
        } catch(error) {
            console.error('Error al cargar los datos:', error)
            this.cargando = false
        }
    },
    computed: {
        resultadosFiltrados() {
            return this.peliculas.filter(item => {
                const coincideNombre = item.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
                const coincidePlataforma = this.plataformaSeleccionada === 'Todas' || item.plataforma === this.plataformaSeleccionada
                return coincideNombre && coincidePlataforma
            })
        }
    },
    methods: {
        verMas(item) {
            const index = this.peliculas.indexOf(item)
            this.peliculas[index].mostrarDesc = !this.peliculas[index].mostrarDesc
        },
        toggleFavorito(item) {
            const index = this.peliculas.indexOf(item)
            this.peliculas[index].favorito = !this.peliculas[index].favorito
            this.guardarFavoritos()
        },
        eliminar(id){
            this.peliculas = this.peliculas.filter(item => item.id !== id)
        },
        guardarFavoritos(){
            const favoritos = this.peliculas.filter(item => item.favorito)
            localStorage.setItem('favoritos', JSON.stringify(favoritos))
        },
        cargarFavoritos(){
            const guardados = localStorage.getItem('favoritos')
            if(guardados){
                const favoritos = JSON.parse(guardados)
                this.peliculas = this.peliculas.map(item => ({
                    ...item,
                    favorito: favoritos.some(fav => fav.id === item.id)
                }))
            }
        }
    }

})

app.mount('#app')