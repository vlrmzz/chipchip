import {
  Box,
  Button,
  Container,
  EmptyState,
  Flex,
  Heading,
  Text,
  Textarea,
  VStack,
  HStack,
  Card,
  Skeleton,
} from "@chakra-ui/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { FiHeart, FiMessageCircle, FiUser } from "react-icons/fi"
import { useState } from "react"

import { TweetsService } from "@/client"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/tweets")({
  component: Tweets,
})

function TweetComposer() {
  const [content, setContent] = useState("")
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()

  const mutation = useMutation({
    mutationFn: (content: string) =>
      TweetsService.createTweet({ requestBody: { content } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] })
      setContent("")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      mutation.mutate(content)
    }
  }

  return (
    <Card.Root p={4} mb={6}>
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <HStack>
            <Box
              w={10}
              h={10}
              rounded="full"
              bg="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
            >
              <FiUser />
            </Box>
            <Text fontWeight="medium">
              {currentUser?.full_name || currentUser?.email}
            </Text>
          </HStack>
          <Textarea
            placeholder="What's chirping?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            rows={3}
          />
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              {280 - content.length} characters remaining
            </Text>
            <Button
              type="submit"
              colorPalette="blue"
              disabled={!content.trim() || mutation.isPending}
              loading={mutation.isPending}
            >
              Chirp
            </Button>
          </Flex>
        </VStack>
      </form>
    </Card.Root>
  )
}

function TweetCard({ tweet }: { tweet: any }) {
  return (
    <Card.Root p={4} mb={4}>
      <VStack align="stretch" gap={3}>
        <HStack>
          <Box
            w={10}
            h={10}
            rounded="full"
            bg="blue.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
          >
            <FiUser />
          </Box>
          <VStack align="start" gap={0}>
            <Text fontWeight="medium">
              {tweet.author?.full_name || tweet.author?.email || "Unknown User"}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(tweet.created_at).toLocaleString()}
            </Text>
          </VStack>
        </HStack>
        <Text pl={12}>{tweet.content}</Text>
        <HStack pl={12} gap={6}>
          <HStack gap={1}>
            <Button variant="ghost" size="sm">
              <FiMessageCircle />
            </Button>
          </HStack>
          <HStack gap={1}>
            <Button variant="ghost" size="sm">
              <FiHeart />
            </Button>
            <Text fontSize="sm" color="gray.500">
              {tweet.likes_count || 0}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Card.Root>
  )
}

function TweetsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["tweets"],
    queryFn: () => TweetsService.readTweets(),
  })

  if (isLoading) {
    return (
      <VStack gap={4}>
        {[...Array(3)].map((_, i) => (
          <Card.Root key={i} p={4} w="full">
            <VStack align="stretch" gap={3}>
              <HStack>
                <Skeleton w={10} h={10} rounded="full" />
                <VStack align="start" gap={1}>
                  <Skeleton h={4} w="120px" />
                  <Skeleton h={3} w="80px" />
                </VStack>
              </HStack>
              <Skeleton pl={12} h={16} />
            </VStack>
          </Card.Root>
        ))}
      </VStack>
    )
  }

  const tweets = data?.data || []

  if (tweets.length === 0) {
    return (
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <FiMessageCircle />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>No chirps yet</EmptyState.Title>
            <EmptyState.Description>
              Be the first to chirp something!
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <VStack align="stretch" gap={0}>
      {tweets.map((tweet: any) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </VStack>
  )
}

function Tweets() {
  return (
    <Container maxW="2xl">
      <VStack align="stretch" gap={6} pt={8}>
        <Heading size="lg">Timeline</Heading>
        <TweetComposer />
        <TweetsList />
      </VStack>
    </Container>
  )
}