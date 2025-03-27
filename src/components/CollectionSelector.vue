<template>
    <div class="collection-selector">
        <Dropdown
            v-model="selected"
            :options="Object.keys(collections)"
            placeholder="Seleziona Collezione"
            class="w-full"
            @change="handleChange"
        />
    </div>
</template>

<script>
export default {
    name: 'CollectionSelector',
    props: {
        collections: {
            type: Object,
            required: true
        },
        selectedCollection: {
            type: String,
            required: true
        }
    },
    computed: {
        selected: {
            get() {
                return this.selectedCollection
            },
            set(value) {
                this.$emit('change', value)
            }
        }
    },
    methods: {
        handleChange(event) {
            this.$emit('change', event.value)
        }
    }
}
</script>

<style scoped>
.collection-selector {
    margin: 20px;
    width: 100%;
}

:deep(.p-dropdown) {
    background-color: #2C2C2C;
    color: #FFFFFF;
}

:deep(.p-dropdown-label) {
    color: #FFFFFF;
}
</style>