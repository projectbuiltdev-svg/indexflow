import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Send } from "lucide-react";

const initialKeywords = [
  { id: 1, keyword: "CANCEL", response: "Your subscription has been cancelled. If this was a mistake, reply START to reactivate." },
  { id: 2, keyword: "CONFIRM", response: "Thank you, {name}! Your appointment on {date} at {time} has been confirmed." },
  { id: 3, keyword: "STATUS", response: "Hi {name}, your current account status is active. Next billing date: {date}." },
  { id: 4, keyword: "HOURS", response: "Our business hours are Monday-Friday 9AM-6PM, Saturday 10AM-4PM. Closed Sundays." },
  { id: 5, keyword: "HELP", response: "Available commands: CANCEL, CONFIRM, STATUS, HOURS, HELP. Reply with any keyword for assistance." },
];

export default function TwilioSms() {
  const { toast } = useToast();

  const [autoReply, setAutoReply] = useState(true);
  const [keywords, setKeywords] = useState(initialKeywords);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testSmsDialogOpen, setTestSmsDialogOpen] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<typeof initialKeywords[0] | null>(null);

  const [newKeywordText, setNewKeywordText] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [editKeywordText, setEditKeywordText] = useState("");
  const [editResponse, setEditResponse] = useState("");
  const [testPhoneNumber, setTestPhoneNumber] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const handleAddKeyword = () => {
    if (!newKeywordText.trim() || !newResponse.trim()) return;
    const newId = Math.max(...keywords.map((k) => k.id), 0) + 1;
    setKeywords([
      ...keywords,
      { id: newId, keyword: newKeywordText.trim().toUpperCase(), response: newResponse.trim() },
    ]);
    setNewKeywordText("");
    setNewResponse("");
    setAddDialogOpen(false);
    toast({ title: "Keyword added", description: `"${newKeywordText.trim().toUpperCase()}" has been added.` });
  };

  const handleEditKeyword = () => {
    if (!selectedKeyword || !editKeywordText.trim() || !editResponse.trim()) return;
    setKeywords(keywords.map((k) =>
      k.id === selectedKeyword.id
        ? { ...k, keyword: editKeywordText.trim().toUpperCase(), response: editResponse.trim() }
        : k
    ));
    setEditDialogOpen(false);
    toast({ title: "Keyword updated", description: `"${editKeywordText.trim().toUpperCase()}" has been updated.` });
    setSelectedKeyword(null);
  };

  const handleDeleteKeyword = () => {
    if (!selectedKeyword) return;
    setKeywords(keywords.filter((k) => k.id !== selectedKeyword.id));
    setDeleteDialogOpen(false);
    toast({ title: "Keyword deleted", description: `"${selectedKeyword.keyword}" has been removed.` });
    setSelectedKeyword(null);
  };

  const handleSave = () => {
    toast({ title: "Settings saved", description: "SMS settings have been saved successfully." });
  };

  const handleSendTestSms = () => {
    if (!testPhoneNumber.trim()) return;
    setTestSmsDialogOpen(false);
    toast({ title: "Test SMS sent", description: `Test message sent to ${testPhoneNumber}.` });
    setTestPhoneNumber("");
    setTestMessage("");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">SMS Settings</h1>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-0.5">
              <Label htmlFor="auto-reply">Auto-Reply</Label>
              <p className="text-xs text-muted-foreground">Automatically respond to incoming SMS with keyword matches</p>
            </div>
            <Switch
              id="auto-reply"
              checked={autoReply}
              onCheckedChange={setAutoReply}
              data-testid="switch-auto-reply"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>Keyword Responses</CardTitle>
          <Button size="sm" data-testid="button-add-keyword" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Keyword
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Response Template</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((kw) => (
                <TableRow key={kw.id} data-testid={`row-keyword-${kw.id}`}>
                  <TableCell>
                    <Badge variant="secondary" data-testid={`badge-keyword-${kw.id}`}>{kw.keyword}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[400px]" data-testid={`text-response-${kw.id}`}>
                    {kw.response}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-edit-keyword-${kw.id}`}
                        onClick={() => {
                          setSelectedKeyword(kw);
                          setEditKeywordText(kw.keyword);
                          setEditResponse(kw.response);
                          setEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-delete-keyword-${kw.id}`}
                        onClick={() => {
                          setSelectedKeyword(kw);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">{"{name}"}</Badge>
            <Badge variant="secondary">{"{date}"}</Badge>
            <Badge variant="secondary">{"{time}"}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Use these variables in your response templates. They will be replaced with actual values when the message is sent.</p>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3 flex-wrap">
        <Button data-testid="button-save-sms" onClick={handleSave}>Save</Button>
        <Button variant="outline" data-testid="button-send-test-sms" onClick={() => setTestSmsDialogOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          Send Test SMS
        </Button>
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Keyword Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="add-keyword-text">Keyword</Label>
              <Input
                id="add-keyword-text"
                placeholder="e.g. BOOK"
                value={newKeywordText}
                onChange={(e) => setNewKeywordText(e.target.value)}
                data-testid="input-new-keyword"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-response">Response Template</Label>
              <Textarea
                id="add-response"
                placeholder="Enter the auto-reply message..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                data-testid="textarea-new-response"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} data-testid="button-cancel-add-keyword">Cancel</Button>
            <Button onClick={handleAddKeyword} data-testid="button-confirm-add-keyword">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Keyword Response</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-keyword-text">Keyword</Label>
              <Input
                id="edit-keyword-text"
                value={editKeywordText}
                onChange={(e) => setEditKeywordText(e.target.value)}
                data-testid="input-edit-keyword"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-response">Response Template</Label>
              <Textarea
                id="edit-response"
                value={editResponse}
                onChange={(e) => setEditResponse(e.target.value)}
                data-testid="textarea-edit-response"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} data-testid="button-cancel-edit-keyword">Cancel</Button>
            <Button onClick={handleEditKeyword} data-testid="button-confirm-edit-keyword">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Keyword</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete the "{selectedKeyword?.keyword}" keyword response? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} data-testid="button-cancel-delete-keyword">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteKeyword} data-testid="button-confirm-delete-keyword">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={testSmsDialogOpen} onOpenChange={setTestSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test SMS</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="test-phone">Phone Number</Label>
              <Input
                id="test-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
                data-testid="input-test-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-message">Message</Label>
              <Textarea
                id="test-message"
                placeholder="Enter test message..."
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                data-testid="textarea-test-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestSmsDialogOpen(false)} data-testid="button-cancel-test-sms">Cancel</Button>
            <Button onClick={handleSendTestSms} data-testid="button-confirm-test-sms">Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
