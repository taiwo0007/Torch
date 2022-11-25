package com.troch.torchApplication.Utilities;


import org.springframework.stereotype.Component;

@Component
public class Counter
{
    private int count;

    public Counter()
    {
        count = 0;
    }

    public Counter(int init)
    {
        count = init;
    }

    public int get()
    {
        return this.count;
    }

    public void clear()
    {
        count = 0;
    }

    public void increment()
    {
         this.count = this.count + 1;
    }

    public String toString()
    {
        return ""+count;
    }
}