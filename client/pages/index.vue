<template>
  <div class="container">
    <CBox
      v-bind="mainStyles[colorMode]"
      d="flex"
      pt="5"
      h="100vh"
      w="100vw"
      flex-dir="column"
      justify-content="top"
    >
      <CFlex justify="center" direction="row" align="center">
        <CButton
          class="btn"
          mt="2"
          mr="3"
          :aria-label="`Switch to 
        ${colorMode === 'light' ? 'dark' : 'light'} mode`"
          variant="link"
          @click="toggleColorMode"
        >
          <CImage
            size="50"
            @click="toggleColorMode"
            :src="require('@/assets/WebSelfie.svg')"
          />
        </CButton>
      </CFlex>
      <CFlex justify="center" direction="column" align="center" mt="5">
        <form id="selfieForm" @submit.prevent="takeSelfie">
          <CFormControl>
            <CStack :spacing="3">
              <CInputGroup size="sm">
                <CInputLeftAddon>{{ protocol }}</CInputLeftAddon>
                <CInput rounded="3" name="url" id="url" v-model="selfie.url" />
              </CInputGroup>
              <CButton
                size="sm"
                id="btn-take"
                class="btn"
                color="grey.400"
                type="submit"
              >
                Take Selfie
              </CButton>
              <CFlex
                v-if="loading"
                mt="3"
                justify="center"
                direction="row"
                align="center"
              >
                <CSpinner
                  thickness="4px"
                  speed="0.65s"
                  empty-color="green.200"
                  color="#00dc82"
                  size="xl"
                />
              </CFlex>
              <CFlex
                v-if="errorMsg != ''"
                mt="3"
                justify="center"
                direction="row"
                align="center"
              >
                <CAlert status="error" rounded="5">
                  <CAlertIcon />
                  {{ errorMsg }}
                </CAlert>
              </CFlex>
              <CFlex justify="center" direction="row" align="center" m="3">
                <CBox w="2xl" v-if="selfie.screenShot != ''">
                  <CImage
                    :src="`data:image/png;base64,` + selfie.screenShot"
                    rounded="3"
                  />
                </CBox>
              </CFlex>
            </CStack>
          </CFormControl>
        </form>
      </CFlex>
    </CBox>
  </div>
</template>

<script lang="js">
import {
  CBox,
  CButton,
  CIconButton,
  CFlex,
  CHeading,
  CFormControl,
  CFormLabel,
  CInput,
  CInputGroup,
  CInputLeftAddon,
  CStack,
  CImage,
  CSwitch,
  CSpinner,
  CAlert,
  CAlertIcon
} from '@chakra-ui/vue'

export default {
  name: 'IndexPage',
  components: {
    CBox,
    CButton,
    CIconButton,
    CFlex,
    CHeading,
    CFormControl,
    CInput,
    CInputGroup,
    CInputLeftAddon,
    CStack,
    CImage,
    CSwitch,
    CSpinner,
    CFormLabel,
    CAlert,
    CAlertIcon
  },
  inject: ['$chakraColorMode', '$toggleColorMode'],
  data() {
    return {
      mainStyles: {
        dark: {
          bg: 'gray.700',
          color: 'whiteAlpha.900'
        },
        light: {
          bg: 'gray.50',
          color: 'gray.900'
        }
      },
      selfie: {
        url: "",
        screenShot: ""
      },
      protocol: "https://",
      errorMsg: "",
      loading: false
    }
  },
  methods: {
    async takeSelfie() {
      try {
        this.loading = true;
        this.errorMsg = "";
        this.selfie.screenShot = "";
        let data = (await this.$axios.post("/screenshot", {
          url: this.protocol + this.selfie.url
        })).data;

        this.selfie.screenShot = data.response.base64;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.errorMsg = error.response.data.error.message;
      }
    },
    showToast() {
      this.$toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 10000,
        isClosable: true
      })
    }
  },
  computed: {
    colorMode() {
      return this.$chakraColorMode()
    },
    theme() {
      return this.$chakraTheme()
    },
    toggleColorMode() {
      return this.$toggleColorMode
    }
  }
}
</script>

<style>
.btn:focus {
  outline: none;
  box-shadow: none;
}

#btn-take {
  background: linear-gradient(to bottom right, #00dc82, #80eec0);
}
</style>
