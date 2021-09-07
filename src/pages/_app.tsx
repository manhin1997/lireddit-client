import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'


function MyApp({ Component, pageProps } : any) {
  return (
    <ChakraProvider resetCSS>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default MyApp
