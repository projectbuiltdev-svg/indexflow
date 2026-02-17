import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, HelpCircle } from "lucide-react";

const faqItems = [
  {
    question: "How do I add a new reservation?",
    answer: "Navigate to the Today or Calendar page and click the 'Add Reservation' button. Fill in the guest details, date, time, and party size, then submit the form.",
  },
  {
    question: "How do I manage business hours?",
    answer: "Go to Settings > Hours to configure your opening and closing times for each day of the week. You can also mark specific days as closed.",
  },
  {
    question: "How do I set up the booking widget?",
    answer: "The booking widget can be embedded on your website. Go to Settings to find your widget configuration options and embed code.",
  },
  {
    question: "How do I export my data?",
    answer: "Visit the Export page to download your reservations, call logs, and support tickets as CSV files.",
  },
  {
    question: "How do I track keyword rankings?",
    answer: "Use the Rank Tracker page to add keywords you want to monitor. The system will track their positions over time.",
  },
  {
    question: "How do I manage room bookings?",
    answer: "Set up your room types first under Rooms > Types, then add individual rooms under Rooms > List. You can then create and manage bookings under Rooms > Bookings.",
  },
  {
    question: "How do I submit a support ticket?",
    answer: "Navigate to the Support page and click 'New Ticket'. Provide a subject, description, and priority level for your issue.",
  },
  {
    question: "How do I request website changes?",
    answer: "Go to the Website Changes page and click 'New Request'. Select the type of change, describe what you need, and submit the request.",
  },
];

export default function Documentation() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;

  const { data: articles = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/knowledge-base?venueId=${venueId}`],
    enabled: !!venueId,
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to view documentation.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Documentation</h1>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Documentation</h1>

      {articles.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <Table data-testid="knowledge-base-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article: any) => (
                  <TableRow key={article.id} data-testid={`article-row-${article.id}`}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="capitalize">{article.category || "-"}</TableCell>
                    <TableCell className="max-w-sm truncate text-muted-foreground">
                      {article.content ? article.content.substring(0, 100) + (article.content.length > 100 ? "..." : "") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5" />Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full" data-testid="faq-accordion">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`} data-testid={`faq-item-${index}`}>
                  <AccordionTrigger data-testid={`faq-trigger-${index}`}>{item.question}</AccordionTrigger>
                  <AccordionContent data-testid={`faq-content-${index}`}>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
