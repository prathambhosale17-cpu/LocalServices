import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/data"
import { Check } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          All Services & Categories
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          Explore a wide range of local services available in your area.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Browse by Category</CardTitle>
          <CardDescription>Click on a category to see the list of services offered.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {categories.map((category) => (
              <AccordionItem value={category.id} key={category.id}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-4">
                        <category.icon className="h-6 w-6 text-primary" />
                        <span>{category.name}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="pt-4 pl-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                        {category.subServices.map((service) => (
                            <div key={service} className="flex items-center gap-3">
                                <Check className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">{service}</span>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
