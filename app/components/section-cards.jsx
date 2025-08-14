import { ChevronRightIcon } from "lucide-react";
import Link from "next/link"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

export function SectionCards({ dashboardData }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.total_courses}
          </CardTitle>
          <CardAction>
            <Link href={"/dashboard/instructor/courses"} className="">
              <ChevronRightIcon />
            </Link>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            You have created a total of {dashboardData.total_courses} courses so far
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Enrolled Students</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.total_enrolled_students.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Link href={"/dashboard/instructor/students"} className="">
              <ChevronRightIcon />
            </Link>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            A total of {dashboardData.total_enrolled_students.toLocaleString()} students have enrolled in your courses
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Published Courses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.published_courses}
          </CardTitle>
          <CardAction>
            <Link href={"/dashboard/instructor/courses"} className="">
              <ChevronRightIcon />
            </Link>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {dashboardData.published_courses} courses published and accessible to students
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Drafts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dashboardData.draft_courses}
          </CardTitle>
          <CardAction>
            <Link href={"/dashboard/instructor/courses"} className="">
              <ChevronRightIcon />
            </Link>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {dashboardData.draft_courses} courses have been drafted and are waiting to be published
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}