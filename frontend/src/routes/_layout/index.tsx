import { Box, Button, Container, Text, VStack } from "@chakra-ui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FiMessageCircle } from "react-icons/fi"

import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()

  return (
    <Container maxW="full">
      <VStack align="start" pt={12} m={4} gap={6}>
        <Box>
          <Text fontSize="2xl" truncate maxW="sm">
            Hi, {currentUser?.full_name || currentUser?.email} 👋🏼
          </Text>
          <Text>Welcome to ChipChip! Your simple social platform.</Text>
        </Box>

        <Box>
          <Text mb={4}>Ready to start chirping?</Text>
          <Button
            colorPalette="blue"
            onClick={() => navigate({ to: "/tweets" as any })}
          >
            <FiMessageCircle />
            Go to Timeline
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}
