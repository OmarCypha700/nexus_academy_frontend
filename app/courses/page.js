"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from "@/app/lib/axios";
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("courses/");
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);

  useEffect(() => {
    // Apply filters whenever search term or price filter changes
    filterCourses();
  }, [searchTerm, priceFilter, courses]);

  const filterCourses = () => {
    let results = [...courses];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price filter
    if (priceFilter === 'free') {
      results = results.filter(course => course.price == 0.00);
    } else if (priceFilter === 'paid') {
      results = results.filter(course => course.price > 0.00);
    } else if (priceFilter === 'under50') {
      results = results.filter(course => course.price > 0.00 && course.price <= 50.00);
    } else if (priceFilter === 'over50') {
      results = results.filter(course => course.price > 50.00);
    }
    
    setFilteredCourses(results);
  };

  const navigateToCourse = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  const renderCourseCard = (course) => {
    return (
      <Card 
        key={course.id} 
        className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            {course.price === 0 ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Free</Badge>
            ) : (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">${course.price}</Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2 text-gray-500 mt-1">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {course.instructor_details && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Instructor:</span> {course.instructor_details.first_name} {course.instructor_details.last_name}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigateToCourse(course.id)}
          >
            View Course
          </Button>
        </CardFooter>
      </Card>
    );
  };

  const renderSkeletonCards = () => {
    return Array(6).fill().map((_, index) => (
      <Card key={index} className="flex flex-col h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-1" />
        </CardHeader>
        <CardContent className="flex-grow">
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Explore Courses</h1>
          
          <div className="flex space-x-2">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters Sheet for Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Courses</SheetTitle>
                  <SheetDescription>
                    Narrow down courses by price range
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Price</p>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="under50">Under $50</SelectItem>
                      <SelectItem value="over50">$50 and above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Desktop Filter */}
            <div className="hidden md:block">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Price Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="under50">Under $50</SelectItem>
                  <SelectItem value="over50">$50 and above</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            renderSkeletonCards()
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map(course => renderCourseCard(course))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No courses found</h3>
              <p className="text-gray-500">
                {searchTerm || priceFilter !== 'all' ? 
                  "Try changing your search criteria or filters" : 
                  "There are no courses available at the moment"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}