import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  VStack,
  Heading,
  Text,
  InputGroup,
  InputElement,
  IconButton,
  useTabs,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/toast";

export default function AdminLogin() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userName}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      // Here you would typically redirect to admin dashboard
    }, 1500);
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="md" py={12}>
        <Card shadow="xl" borderRadius="xl">
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Box
                  display="inline-flex"
                  p={3}
                  bg="blue.500"
                  borderRadius="full"
                  mb={4}
                >
                  <LockIcon boxSize={6} color="white" />
                </Box>
                <Heading size="lg" mb={2}>
                  Admin Login
                </Heading>
                <Text color="gray.600">
                  Enter your credentials to access the admin panel
                </Text>
              </Box>

              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    size="lg"
                    focusBorderColor="blue.500"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      borderColor="blue.500"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit(e);
                        }
                      }}
                    />
                    <InputElement>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        _icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputElement>
                  </InputGroup>
                </FormControl>

                <Button
                  onClick={handleSubmit}
                  colorScheme="blue"
                  size="lg"
                  width="100%"
                  loading={isLoading}
                  loadingText="Logging in..."
                  mt={2}
                >
                  Login
                </Button>
              </VStack>

              <Text fontSize="sm" color="gray.500" textAlign="center">
                Contact your system administrator if you've forgotten your
                credentials
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
}
