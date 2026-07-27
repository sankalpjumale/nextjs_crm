import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, BarChart3, User, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">

      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
              Now in public beta
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Manage customers, close deals, grow faster
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              CRM Pro brings your contacts, pipeline, and team into one clean workspace.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <Button size="lg">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </section>

        <section id="features" className="border-t bg-muted/30 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-6">
                <User className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">Contact Management</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Keep every customer detail organized in one place.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <BarChart3 className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">Sales Pipeline</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Track deals from lead to close with visual boards.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <Zap className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">Automation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Automate follow-ups and repetitive tasks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
