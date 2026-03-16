// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::{Parser, Subcommand,};

#[derive(Parser)]
#[command(name = "dex")]
#[command(version)]
#[command(about = "Decomplexified Execution (DEX) is a tool for managing complex workflows across major Linux distributions under one unified interface.")]
struct Cli {
    #[command(subcommand)]
    command: Option<Command>,
}

#[derive(Subcommand)]
pub enum Command {
    Install,
    Uninstall,
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Some(command) => {
            match command {
             Command::Install => {
                println!("Installing DEX...")
             }   
             Command::Uninstall => {
                println!("Uninstalling DEX...")
             }
            }
        }
        None => {
            dex_lib::run()
        }
    }
}

