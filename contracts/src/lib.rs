#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol, Map};

#[contract]
pub struct LivePollContract;

#[contractimpl]
impl LivePollContract {
    pub fn vote(env: Env, option: Symbol) {
        let mut votes: Map<Symbol, u32> = env
            .storage()
            .instance()
            .get(&symbol_short!("VOTES"))
            .unwrap_or(Map::new(&env));
            
        let count = votes.get(option.clone()).unwrap_or(0);
        votes.set(option.clone(), count + 1);
        env.storage().instance().set(&symbol_short!("VOTES"), &votes);
        
        env.events().publish((symbol_short!("Voted"), option), count + 1);
    }

    pub fn get_votes(env: Env) -> Map<Symbol, u32> {
        env.storage().instance().get(&symbol_short!("VOTES")).unwrap_or(Map::new(&env))
    }
}
