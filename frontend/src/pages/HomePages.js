import React from 'react';
import { Box, Container, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

const HomePages = () => {
    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={3}
                bg="white"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans" textAlign="center">
                    Chatting with anyone
                </Text>
            </Box>

            <Box bg="white" w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px">

                <Tabs variant='soft-rounded' >
                    <TabList mb="1em">
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <p>one!</p>
                        </TabPanel>
                        <TabPanel>
                            <p>two!</p>
                        </TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Container >
    );
};

export default HomePages;
