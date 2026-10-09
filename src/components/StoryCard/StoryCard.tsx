import { Link } from "react-router-dom";
import { Badge, Card, Group, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { IconChevronUp, IconClock, IconMessageCircle, IconUser } from "@tabler/icons-react";
import type { Post } from "../../features/post/postSlice";
import { fullDate, getDomain, timeAgo } from "../../lib/format";
import classes from "./StoryCard.module.css";

const HOT_SCORE = 300;

interface StoryCardProps {
  post: Post;
  rank: number;
}

export function StoryCard({ post, rank }: StoryCardProps) {
  const domain = getDomain(post.url);
  const score = post.score ?? 0;

  return (
    <Card component={Link} to={`/post/${post.id}`} withBorder padding="md" className={classes.card}>
      <Group wrap="nowrap" align="flex-start" gap="md">
        <Text ff="monospace" size="sm" c="dimmed" className={classes.rank} visibleFrom="xs">
          {rank}
        </Text>

        <Stack gap={8} style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} lh={1.4} className={classes.title}>
            {post.title}
          </Text>
          <Group gap="md" style={{ rowGap: 4 }} c="dimmed" fz="xs">
            {domain && (
              <Badge variant="light" color="gray" radius="sm" size="sm" tt="none" fw={500}>
                {domain}
              </Badge>
            )}
            <span className={classes.meta}>
              <IconUser size={14} stroke={1.75} />
              {post.by}
            </span>
            <Tooltip label={fullDate(post.time)}>
              <span className={classes.meta}>
                <IconClock size={14} stroke={1.75} />
                {timeAgo(post.time)}
              </span>
            </Tooltip>
            <span className={classes.meta}>
              <IconMessageCircle size={14} stroke={1.75} />
              {post.descendants ?? 0}
            </span>
          </Group>
        </Stack>

        <div className={`${classes.score} ${score >= HOT_SCORE ? classes.hot : ""}`}>
          <IconChevronUp size={16} stroke={2.5} />
          <Text size="sm" fw={700} lh={1.2}>
            {score}
          </Text>
        </div>
      </Group>
    </Card>
  );
}

export function StoryCardSkeleton() {
  return (
    <Card withBorder padding="md">
      <Group wrap="nowrap" align="flex-start" gap="md">
        <Skeleton height={14} width={24} mt={4} visibleFrom="xs" />
        <Stack gap={10} style={{ flex: 1 }}>
          <Skeleton height={16} width="85%" />
          <Skeleton height={12} width="55%" />
        </Stack>
        <Skeleton height={48} width={56} />
      </Group>
    </Card>
  );
}
